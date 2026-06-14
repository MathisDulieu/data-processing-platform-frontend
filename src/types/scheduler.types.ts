export type ScheduleType = "CRON" | "FIXED_DELAY";

export interface BatchScheduleRequest {
    enabled: boolean;
    scheduleType?: ScheduleType;
    cronExpression?: string;
    fixedDelayMs?: number;
}

export interface BatchScheduleResponse {
    id: number;
    enabled: boolean;
    scheduleType: ScheduleType | null;
    cronExpression: string | null;
    fixedDelayMs: number | null;
    updatedAt: string;
}

export interface BatchScheduleStatusResponse {
    enabled: boolean;
    scheduleType: ScheduleType | null;
    cronExpression: string | null;
    fixedDelayMs: number | null;
    lastExecutionAt: string | null;
    nextExecutionAt: string | null;
}