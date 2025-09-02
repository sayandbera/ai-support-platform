import { v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { getSecretsValue, parseSecretString } from "../lib/secrets";

export const getVapiSecrets = action({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrgIdAndService,
      {
        orgId: args.orgId,
        service: "vapi",
      }
    );

    if (!plugin) {
      return null;
    }

    const secretName = plugin.secretName;
    const secret = await getSecretsValue(secretName);
    const secretData = parseSecretString<{
      publicApiKey: string;
      privateApiKey: string;
    }>(secret);

    if (!secretData || !secretData.publicApiKey || !secretData.privateApiKey) {
      return null;
    }

    return {
      publicApiKey: secretData.publicApiKey,
    };
  },
});
