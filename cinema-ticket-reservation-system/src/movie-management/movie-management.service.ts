import {Injectable} from '@nestjs/common';
import {InjectMapper} from "@automapper/nestjs";
import {Mapper} from "@automapper/core";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Movie} from "../database/entity/movie";
import {MovieDto} from "./dto/movie.dto";

@Injectable()
export class MovieManagementService {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(Movie) private userRepository: Repository<Movie>,
    ) {
    }

    async createAsync(movieDto: MovieDto, fileName: string) {
        console.log(movieDto)
        return {msg: movieDto}
    }
}
