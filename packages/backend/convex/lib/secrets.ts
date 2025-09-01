import {
  CreateSecretCommand,
  GetSecretValueCommand,
  PutSecretValueCommand,
  ResourceExistsException,
  SecretsManagerClient,
  type GetSecretValueCommandOutput,
} from "@aws-sdk/client-secrets-manager";

export function createSecretsManagerClient(): SecretsManagerClient {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS credentials or region are not configured in environment variables."
    );
  }

  return new SecretsManagerClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function getSecretsValue(
  secretName: string
): Promise<GetSecretValueCommandOutput> {
  const client = createSecretsManagerClient();
  return await client.send(new GetSecretValueCommand({ SecretId: secretName }));
}

export async function upsertSecret(
  secretName: string,
  secretValue: Record<string, unknown>
): Promise<void> {
  const client = createSecretsManagerClient();

  try {
    await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue),
      })
    );
  } catch (error) {
    // If secret already exists, update
    if (error instanceof ResourceExistsException) {
      await client.send(
        new PutSecretValueCommand({
          SecretId: secretName,
          SecretString: JSON.stringify(secretValue),
        })
      );
    } else {
      throw error;
    }
  }
}

export function parseSecretString<T = Record<string, unknown>>(
  secret: GetSecretValueCommandOutput
): T | null {
  if (!secret.SecretString) return null;

  try {
    return JSON.parse(secret.SecretString) as T;
  } catch {
    return null;
  }
}
