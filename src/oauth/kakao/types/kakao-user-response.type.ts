export type KakaoUserResponse = {
  id: number;
  connected_at?: string;

  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
    };
  };
};
