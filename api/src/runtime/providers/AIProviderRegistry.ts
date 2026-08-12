import type {
    AIProvider
} from "./AIProvider.js";

export interface AIProviderDescriptor {
    provider: string;
    model: string;
    implementation: AIProvider;
}

export class AIProviderRegistry {

    private readonly providers =
        new Map<string, AIProviderDescriptor>();

    register(
        descriptor: AIProviderDescriptor
    ): void {

        const key =
            this.createKey(
                descriptor.provider,
                descriptor.model
            );

        if (
            this.providers.has(key)
        ) {

            throw new Error(
                `AI provider already registered: ${key}`
            );

        }

        this.providers.set(
            key,
            descriptor
        );

    }

    resolve(
        provider: string,
        model: string
    ): AIProvider {

        const key =
            this.createKey(
                provider,
                model
            );

        const descriptor =
            this.providers.get(key);

        if (!descriptor) {

            throw new Error(
                `AI provider not registered: ${key}`
            );

        }

        return descriptor.implementation;

    }

    has(
        provider: string,
        model: string
    ): boolean {

        return this.providers.has(
            this.createKey(
                provider,
                model
            )
        );

    }

    private createKey(
        provider: string,
        model: string
    ): string {

        return `${provider}:${model}`;

    }

}
