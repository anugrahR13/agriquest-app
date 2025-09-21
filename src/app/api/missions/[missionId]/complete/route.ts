import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ missionId: string }> }) {
  try {
    // Resolve the params promise
    const resolvedParams = await params;
    const { missionId } = resolvedParams;

    // Get the farmer mission
    const farmerMission = await prisma.farmerMission.findUnique({
      where: { id: missionId }
    });

    if (!farmerMission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // Update farmer mission status to completed
    const updatedFarmerMission = await prisma.farmerMission.update({
      where: { id: missionId },
      data: { 
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    return NextResponse.json(updatedFarmerMission);
  } catch (error) {
    console.error('Error completing mission:', error);
    return NextResponse.json({ error: 'Failed to complete mission' }, { status: 500 });
  }
}