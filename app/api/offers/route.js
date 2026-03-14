import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/adminAuth";
import { readContentByKey, writeContentByKey } from "@/lib/serverContent";

async function readOffersData() {
  const record = await readContentByKey("offers");
  return record?.content || { header: { title: "", description: "", bgImage: "" }, offers: [] };
}

async function writeOffersData(data) {
  await writeContentByKey("offers", data);
}

function toNumberId(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
  try {
    const data = await readOffersData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const data = await readOffersData();

    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim();
    const link = String(body.link || "#").trim();

    if (!title || !description || !image) {
      return NextResponse.json(
        { success: false, error: "Title, description and image are required." },
        { status: 400 }
      );
    }

    const currentMaxId = data.offers.reduce(
      (max, offer) => (offer.id > max ? offer.id : max),
      0
    );

    const newOffer = {
      id: currentMaxId + 1,
      title,
      description,
      image,
      link: link || "#",
    };

    data.offers.unshift(newOffer);
    await writeOffersData(data);

    return NextResponse.json({ success: true, data: newOffer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const id = toNumberId(body.id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Valid offer id is required." },
        { status: 400 }
      );
    }

    const data = await readOffersData();
    const offerIndex = data.offers.findIndex((offer) => offer.id === id);

    if (offerIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Offer not found." },
        { status: 404 }
      );
    }

    const current = data.offers[offerIndex];
    const updated = {
      ...current,
      title: body.title !== undefined ? String(body.title).trim() : current.title,
      description:
        body.description !== undefined
          ? String(body.description).trim()
          : current.description,
      image: body.image !== undefined ? String(body.image).trim() : current.image,
      link: body.link !== undefined ? String(body.link).trim() : current.link,
    };

    data.offers[offerIndex] = updated;
    await writeOffersData(data);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const id = toNumberId(body.id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Valid offer id is required." },
        { status: 400 }
      );
    }

    const data = await readOffersData();
    const nextOffers = data.offers.filter((offer) => offer.id !== id);

    if (nextOffers.length === data.offers.length) {
      return NextResponse.json(
        { success: false, error: "Offer not found." },
        { status: 404 }
      );
    }

    data.offers = nextOffers;
    await writeOffersData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
