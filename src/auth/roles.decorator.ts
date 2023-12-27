import { Role } from 'src/user/types/userRole.type'; // userRole 타입(enum) 사용

import { SetMetadata } from '@nestjs/common'; // 유효성 검사 파이프

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
