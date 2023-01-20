import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { dataSource } from './database/data-source';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ValidationPipe } from './shared/pipe/validation.pipe';


async function bootstrap() {
  dataSource.initialize().then(async () => {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
      .setTitle('Cinema ticket reservation system')
      .setDescription('Cinema ticket reservation system API')
      .setVersion('1.0')
      .addBearerAuth()
      .addOAuth2()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);


    await app.listen(
      3001,
      () => console.log('Server started on http://localhost:3001/swagger'));
  }).catch(error => console.log(error));
}

bootstrap();
