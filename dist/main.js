"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const nest_winston_1 = require("nest-winston");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3000);
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('ShopSphere API')
        .setDescription('E-commerce API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('e-commerce')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(port);
    common_1.Logger.log(`Application is running on: http://localhost:${port}`);
    common_1.Logger.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap().catch((err) => {
    common_1.Logger.error(`Error starting server: ${err.message}`, err.stack, 'Bootstrap');
    process.exit(1);
});
//# sourceMappingURL=main.js.map