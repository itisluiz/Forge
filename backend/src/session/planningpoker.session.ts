import { Model } from "sequelize";
import { randomBytes } from "crypto";
import NodeCache from "node-cache";

const sessionTTL = 900;
const participantTTL = 60;
const planningpokerSessions = new NodeCache({ stdTTL: sessionTTL, checkperiod: 300, useClones: false });

interface PlanningpokerSessionParticipant {
	lastHeartbeat: Date;
	vote?: null | number;
	user: Model<any, any>;
}

interface PlanningpokerSession {
	agenda: string;
	projectId: number;
	userstories: Model<any, any>[];
	participants: PlanningpokerSessionParticipant[];
	selectedTaskId: number | null;
	averageVote?: number;
	revealed: boolean;
}

function cleanupParticipants(session: PlanningpokerSession) {
	const now = Date.now();
	session.participants = session.participants.filter(
		(participant) => participant.lastHeartbeat.getTime() + participantTTL * 1000 < now,
	);
}

function create(agenda: string, projectId: number, userstories: Model<any, any>[]): string {
	const sessionCode = randomBytes(12).toString("hex");
	const session: PlanningpokerSession = {
		agenda,
		projectId,
		userstories,
		participants: [],
		selectedTaskId: null,
		revealed: false,
	};

	console.log(session);

	planningpokerSessions.set(sessionCode, session);
	return sessionCode;
}

function get(sessionCode: string) {
	const session = planningpokerSessions.get(sessionCode) as PlanningpokerSession;
	if (!session) {
		return;
	}

	cleanupParticipants(session);
	planningpokerSessions.ttl(sessionCode, sessionTTL);
	return planningpokerSessions.get(sessionCode);
}

export const planningpoker = { create, get };
