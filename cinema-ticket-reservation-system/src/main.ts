import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
    AppDataSource.initialize().then(async () => {

        // console.log('Inserting a new user into the database...')
        // const user = new User()
        // user.name = 'Timber'
        // user.email = 'Saw'
        // user.passwordHash = '25'
        // await AppDataSource.manager.save(user)
        // console.log('Saved a new user with id: ' + user.id)
        //
        // console.log('Loading users from the database...')
        // const users = await AppDataSource.manager.find(User)
        // console.log('Loaded users: ', users)
        //
        // console.log('Here you can setup and run express / fastify / any other framework.')

        const app = await NestFactory.create(AppModule);
        app.enableCors();
        app.useGlobalFilters(new HttpExceptionFilter());
        app.useGlobalPipes(new ValidationPipe(
            {
                exceptionFactory: errors =>
                    new BadRequestException(errors),
            }));


        const config = new DocumentBuilder()
            .setTitle('Cinema ticket reservation system')
            .setDescription('Cinema ticket reservation system API')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('swagger', app, document);


        await app.listen(
            3001,
            () => console.log('Server started on http://localhost:3001/swagger'));
    }).catch(error => console.log(error));
}

bootstrap();
