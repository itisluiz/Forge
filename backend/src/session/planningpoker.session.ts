import { Model } from "sequelize";
import { randomBytes } from "crypto";
import NodeCache from "node-cache";

const sessionTTL = 300;
const participantTTL = 30;
const planningpokerSessions = new NodeCache({
	stdTTL: sessionTTL,
	checkperiod: 300,
	useClones: false,
	deleteOnExpire: true,
});

export interface PlanningpokerParticipant {
	lastHeartbeat: Date;
	vote?: null | number;
	user: Model<any, any>;
}

export interface PlanningpokerSession {
	sessionCode: string;
	agenda: string;
	project: Model<any, any>;
	sprint: Model<any, any>;
	participants: PlanningpokerParticipant[];
	selectedUserstoryId: number | null;
	revealed: boolean;
	voteAverage?: number | null;
	voteClosestFibonacci?: number | null;
}

function cleanupParticipants(session: PlanningpokerSession) {
	const now = Date.now();
	session.participants = session.participants.filter(
		(participant) => participant.lastHeartbeat.getTime() + participantTTL * 1000 > now,
	);
}

function heartbeatParticipant(session: PlanningpokerSession, user: Model<any, any>) {
	const participant = session.participants.find((participant) => participant.user.dataValues.id === user.dataValues.id);
	if (!participant) {
		session.participants.push({ lastHeartbeat: new Date(), user });
		return;
	}

	participant.lastHeartbeat = new Date();
}

function create(agenda: string, project: Model<any, any>, sprint: Model<any, any>): string {
	const sessionCode = randomBytes(12).toString("hex");
	const session: PlanningpokerSession = {
		sessionCode,
		agenda,
		project,
		sprint,
		participants: [],
		selectedUserstoryId: null,
		revealed: false,
	};

	planningpokerSessions.set(sessionCode, session);
	return sessionCode;
}

function get(sessionCode: string): PlanningpokerSession | undefined {
	const session = planningpokerSessions.get(sessionCode) as PlanningpokerSession;
	if (!session) {
		return;
	}

	cleanupParticipants(session);
	planningpokerSessions.ttl(sessionCode, sessionTTL);
	return planningpokerSessions.get(sessionCode);
}

function getByProjectId(projectId: number): PlanningpokerSession[] {
	const sessions = planningpokerSessions
		.keys()
		.map((sessionCode) => planningpokerSessions.get(sessionCode) as PlanningpokerSession)
		.filter((session) => session && session.project.dataValues.id === projectId);

	sessions.forEach((session) => cleanupParticipants(session));
	return sessions;
}

export const planningpoker = { create, get, getByProjectId, heartbeatParticipant };
