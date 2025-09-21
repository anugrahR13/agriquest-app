import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ missionId: string }> }) {
  try {
    // Resolve the params promise
    const resolvedParams = await params;
    const { missionId } = resolvedParams;

    // Get the mission with its associated farm
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { farm: true }
    });

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // Update mission status to completed
    const updatedMission = await prisma.mission.update({
      where: { id: missionId },
      data: { 
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    return NextResponse.json(updatedMission);
  } catch (error) {
    console.error('Error completing mission:', error);
    return NextResponse.json({ error: 'Failed to complete mission' }, { status: 500 });
  }
}