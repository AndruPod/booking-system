import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { logger } from "./common/middlewares/logger.middleware";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT;

    const config = new DocumentBuilder()
        .setTitle("Booking System")
        .setDescription("Booking apartment system")
        .setVersion("1.0")
        .addTag("Project")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.use(logger);
    await app.listen(PORT ?? 5000, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

bootstrap();
