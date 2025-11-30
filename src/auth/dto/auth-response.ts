import { ApiProperty } from "@nestjs/swagger";


export class AuthResponseDto {
    @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY0MTUxNDIxLCJleHAiOjE3NjQxNTUwMjF9.mFIA7JcHk2Wka1A6xWxaOzNodf8v8S8uFRfCzwOIlq0', description: 'Access Token'})
    access_token: string;
}