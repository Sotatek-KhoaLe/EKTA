import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ConfigService } from '@/config';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: config.DOC_PATH,
          serveRoot: '/overview',
          serveStaticOptions: {
            cacheControl: true,
            dotfiles: 'deny',
            fallthrough: false,
          },
        },
      ],
    }),
  ],
  providers: [],
})
export class DocsModule {}
