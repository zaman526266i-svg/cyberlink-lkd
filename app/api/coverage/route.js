import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/adminAuth";
import { readContentByKey, writeContentByKey } from "@/lib/serverContent";

async function readCoverageData() {
  const record = await readContentByKey("coverage");
  return record?.content || { header: { title: "", description: "", bgVideo: "" }, regions: [] };
}

async function writeCoverageData(data) {
  await writeContentByKey("coverage", data);
}

function toNumberId(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
  try {
    const data = await readCoverageData();
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
    const data = await readCoverageData();

    const name = String(body.name || "").trim();
    const subtitle = String(body.subtitle || "").trim();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Region name is required." },
        { status: 400 }
      );
    }

    const currentMaxId = data.regions.reduce(
      (max, region) => (region.id > max ? region.id : max),
      0
    );

    const newRegion = {
      id: currentMaxId + 1,
      name,
      subtitle: subtitle || `Check the available area for the ${name} Region`,
      areas: [],
    };

    data.regions.push(newRegion);
    await writeCoverageData(data);

    return NextResponse.json({ success: true, data: newRegion }, { status: 201 });
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
    const regionId = toNumberId(body.regionId);
    const action = body.action;

    if (!regionId || !action) {
      return NextResponse.json(
        { success: false, error: "regionId and action are required." },
        { status: 400 }
      );
    }

    const data = await readCoverageData();
    const regionIndex = data.regions.findIndex((region) => region.id === regionId);

    if (regionIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Region not found." },
        { status: 404 }
      );
    }

    const region = data.regions[regionIndex];

    if (action === "add-area") {
      const area = String(body.area || "").trim();
      if (!area) {
        return NextResponse.json(
          { success: false, error: "Area name is required." },
          { status: 400 }
        );
      }

      const exists = region.areas.some(
        (currentArea) => currentArea.toLowerCase() === area.toLowerCase()
      );
      if (!exists) {
        region.areas.push(area);
      }
    } else if (action === "remove-area") {
      const area = String(body.area || "").trim();
      region.areas = region.areas.filter((currentArea) => currentArea !== area);
    } else if (action === "update-region") {
      const name = String(body.name || "").trim();
      const subtitle = String(body.subtitle || "").trim();
      if (!name) {
        return NextResponse.json(
          { success: false, error: "Region name is required." },
          { status: 400 }
        );
      }
      region.name = name;
      region.subtitle = subtitle || region.subtitle;
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported action." },
        { status: 400 }
      );
    }

    data.regions[regionIndex] = region;
    await writeCoverageData(data);

    return NextResponse.json({ success: true, data: region });
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
    const regionId = toNumberId(body.regionId);

    if (!regionId) {
      return NextResponse.json(
        { success: false, error: "Valid regionId is required." },
        { status: 400 }
      );
    }

    const data = await readCoverageData();
    const nextRegions = data.regions.filter((region) => region.id !== regionId);

    if (nextRegions.length === data.regions.length) {
      return NextResponse.json(
        { success: false, error: "Region not found." },
        { status: 404 }
      );
    }

    data.regions = nextRegions;
    await writeCoverageData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
