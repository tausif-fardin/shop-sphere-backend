import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    HealthCheck,
    HealthCheckService,
    MongooseHealthIndicator,
    MemoryHealthIndicator,
    DiskHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly mongoose: MongooseHealthIndicator,
        private readonly memory: MemoryHealthIndicator,
        private readonly disk: DiskHealthIndicator,
    ) { }

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: 'Check the health of the application' })
    check() {
        return this.health.check([
            () => this.mongoose.pingCheck('mongodb'),
            () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024), // 200MB
            () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024), // 3GB
            () =>
                this.disk.checkStorage('disk_storage', {
                    thresholdPercent: 0.9, // 90% of the disk space
                    path: '/',
                }),
        ]);
    }
}