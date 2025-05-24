import { HealthCheckService, MongooseHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
export declare class HealthController {
    private readonly health;
    private readonly mongoose;
    private readonly memory;
    private readonly disk;
    constructor(health: HealthCheckService, mongoose: MongooseHealthIndicator, memory: MemoryHealthIndicator, disk: DiskHealthIndicator);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
