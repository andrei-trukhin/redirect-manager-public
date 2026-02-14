import {ArrayProperty, CustomProperty, NumberProperty, StringProperty} from "bookish-potato-dto";

export class HandleRedirectsConfig {

    @StringProperty({
        defaultValue: 'https://example.com'
    })
    readonly REVERSE_PROXY_TARGET_BASE_URL!: string;

    @NumberProperty({
        defaultValue: 10_000 // 10 seconds
    })
    readonly REVERSE_PROXY_TIMEOUT_MILLISECONDS!: number;

    @ArrayProperty('string', {
        defaultValue: [
            'connection',
            'keep-alive',
            'proxy-authenticate',
            'proxy-authorization',
            'te',
            'trailer',
            'transfer-encoding',
            'upgrade'
        ]
    })
    readonly HOB_BY_HOP_HEADERS!: string[];

    @CustomProperty<Record<string, string>>({
        isOptional: true,
        parser: {
            parse: (value: unknown) => {
                // check if typeof string
                if (typeof value !== 'string') {
                    throw new Error('CUSTOM_HEADERS must be a JSON string');
                }

                try {
                    const parsed = JSON.parse(value);
                    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                        throw new Error('CUSTOM_HEADERS must be a JSON object');
                    }

                    // check if all keys and values are strings
                    for (const [key, val] of Object.entries(parsed)) {
                        if (typeof key !== 'string' || typeof val !== 'string') {
                            throw new Error('CUSTOM_HEADERS must be a JSON object with string keys and string values');
                        }
                    }

                    return parsed as Record<string, string>;
                } catch (e) {
                    throw new Error('CUSTOM_HEADERS must be a valid JSON string representing an object');
                }
            }
        },
        parsingErrorMessage: (key: string) => {
            return `Custom Headers should be configured for a key "${key}" as a valid JSON string representing an object with string keys and string values.`;
        }
    })
    readonly CUSTOM_HEADERS?: Record<string, string>;

}