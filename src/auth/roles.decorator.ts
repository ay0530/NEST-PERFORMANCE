import { Role } from 'src/user/types/userRole.type'; // userRole 타입(enum) 사용

import { SetMetadata } from '@nestjs/common'; // 유효성 검사 파이프

// ...roles : 함수에 전달된 여러 인자들을 단일 배열로 그룹화(... : Rest Parameters, 나머지 매개변수 문법)
// SetMetadata('키', 벨류) : 라우트 핸들러나 클래스에 메타데이터 설정
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
