import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Domain modules (stubs)
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { BountiesModule } from './modules/bounties/bounties.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { BadgesModule } from './modules/badges/badges.module';
import { TiersModule } from './modules/tiers/tiers.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SolanaModule } from './modules/solana/solana.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Domain modules
    AuthModule,
    UsersModule,
    ProfilesModule,
    BountiesModule,
    SubmissionsModule,
    LeaderboardModule,
    BadgesModule,
    TiersModule,
    NotificationsModule,
    SolanaModule,
    WalletModule,
  ],
})
export class AppModule {}