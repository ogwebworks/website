import { onRequestPost as __api_proposal_ts_onRequestPost } from "/home/user/website/functions/api/proposal.ts"

export const routes = [
    {
      routePath: "/api/proposal",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_proposal_ts_onRequestPost],
    },
  ]