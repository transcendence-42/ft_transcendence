import { Controller } from '@nestjs/common';

@Controller('user')
export class UserController {}

// Each function returns somehting
// Only return DTO and interfaces (classes)
// if you can don't wait for only one thing. Do your stuff or wait for many things at the same time.

// Specs:
// get_user(): done
// delete_user(): @guardOwnUser
// delete_channel(): @guardChannelAdmin
// get_stats(): @guardUser
// get_ladder(): @guardUser
//      
