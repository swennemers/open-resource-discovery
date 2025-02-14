/**
 * The [ORD Document](../index.md#ord-document) object serves as a wrapper for the **ORD resources** and **ORD taxonomy** and adds further top-level information
 * that are specific to the document/the service it describes.
 *
 * The constraints and considerations on [ORD Documents](../index.md#ord-document) MUST be followed.
 */
export interface ORDDocument {
    /**
     * An optional [URL](https://tools.ietf.org/html/rfc3986) to the Open Resource Discovery document schema (Defined as a JSON Schema).
     *
     * If provided, this enables code intelligence and validation in supported editors (like VSCode) and tools.
     */
    $schema?: string;
    /**
     * Version of the Open Resource Discovery specification that is used to describe this document.
     */
    openResourceDiscovery: "1.0" | "1.1" | "1.2" | "1.3" | "1.4" | "1.5" | "1.6" | "1.7";
    /**
     * Optional description of the ORD document itself.
     * Please note that this information is NOT further processed or considered by an ORD aggregator.
     *
     * Notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description?: string;
    describedSystemInstance?: SystemInstance;
    /**
     * The [policy level](../../spec-extensions/access-strategies/) (aka. compliance level) that this ORD Document or part of it needs to be compliant with.
     * Depending on the chosen policy level, certain expectations and validations rules will be applied.
     *
     * The policy level can be defined on ORD Document level, but also be overwritten on an individual package or resource level.
     *
     * If not provided, no additional policy level expectations and validations apply.
     *
     */
    policyLevel?: "none" | "sap:core:v1" | "custom";
    /**
     * If the fixed `policyLevel` values need to be extended, an arbitrary `customPolicyLevel` can be provided.
     *
     * The policy level is inherited from packages to resources they contain, but can be overwritten at resource level.
     *
     * MUST only be provided if `policyLevel` is set to `custom`.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     */
    customPolicyLevel?: string;
    /**
     * Array of all API Resources that are described in this ORD document.
     */
    apiResources?: APIResource[];
    /**
     * Array of all event resources that are described in this ORD document.
     */
    eventResources?: EventResource[];
    /**
     * Array of all entity types that are described in this ORD document.
     */
    entityTypes?: EntityType[];
    /**
     * Array of all capabilities that are described in this ORD document.
     */
    capabilities?: Capability[];
    /**
     * Array of all integration dependencies that are described in this ORD document.
     */
    integrationDependencies?: IntegrationDependency[];
    /**
     * Array of all Vendors that are described in this ORD document.
     */
    vendors?: Vendor[];
    /**
     * Array of all Products that are described in this ORD document.
     */
    products?: Product[];
    /**
     * Array of all Packages that are described in this ORD document.
     */
    packages?: Package[];
    /**
     * Array of all Consumption Bundles that are described in this ORD document.
     */
    consumptionBundles?: ConsumptionBundle[];
    /**
     * List of ORD information (resources or taxonomy) that have been "tombstoned"/removed.
     * This MUST be indicated explicitly, so that ORD aggregators and consumers can learn about the removal.
     *
     * A tombstone entry MAY be removed after a grace period of 31 days.
     */
    tombstones?: Tombstone[];
}
/**
 * A **system instance** is a concrete, running instance of a system type.
 * In a multi-tenant system, this corresponds to a tenant.
 */
export interface SystemInstance {
    /**
     * Optional [base URL](../index.md#def-base-url) of the **system instance**.
     * By providing the base URL, all relative references in the document are resolved relative to it.
     *
     * The `baseUrl` MUST not contain a leading slash.
     *
     * MUST be provided if the base URL is not known to the ORD aggregators.
     * MUST be provided when the document needs to be fully self contained, e.g. when used for manual imports.
     */
    baseUrl?: string;
    /**
     * Optional local ID for the system instance, as known by the described system.
     *
     * In the context of a system instance, this is usually the local tenant id.
     */
    localId?: string;
    /**
     * Correlation IDs can be used to create a reference to related data in other repositories (especially to the system of record).
     *
     * MUST be a valid [Correlation ID](../index.md#correlation-id).
     */
    correlationIds?: string[];
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
}
/**
 * Generic labels that can be applied to most ORD information.
 * They are defined as an object that may have arbitrary keys.
 * The value of a key is an array of strings.
 *
 * Labels can be used to attach technical information that cannot be expressed natively in ORD.
 * An ORD aggregator should allow to categorize and query information based on the labels provided.
 *
 * If multiple parties rely on the existence of certain label information,
 * standardization through ORD SHOULD be preferred.
 *
 * All labels attached to a `Package` will be inherited to the resources they contain.
 * Duplicate labels will be merged by the ORD aggregator according to the following rules:
 * * Values of the same label key will be merged.
 * * Duplicate values of the same label key will be removed.
 */
export interface Labels {
    /**
     * This interface was referenced by `Labels`'s JSON-Schema definition
     * via the `patternProperty` "^[a-zA-Z0-9-_.]*$".
     */
    [k: string]: string[];
}
/**
 * Generic documentation labels that can be applied to most ORD information.
 * They are defined as an object that may have arbitrary keys.
 * The value of a key is an array of [CommonMark](https://spec.commonmark.org/) (Markdown) text.
 *
 * Documentation Labels can be used to attach human readable documentation that cannot be expressed natively in ORD.
 * A documentation tool (like an API Catalog) can use the documentation labels to provide generic documentation "snippets".
 * Due to the given structure they can be displayed e.g. as tables.
 *
 * The key of the documentation Label is plain-text (MUST not contain line breaks) and denotes the subject matter that is described.
 * The values (multiple can be provided for the same key) are [CommonMark](https://spec.commonmark.org/) (Markdown) text
 * which describes the subject matter or lists options for the key.
 *
 * In contrast to regular labels, documentation labels are not meant to be used to categorize or query information.
 */
export interface DocumentationLabels {
    /**
     * This interface was referenced by `DocumentationLabels`'s JSON-Schema definition
     * via the `patternProperty` "^.*$".
     */
    [k: string]: string[];
}
/**
 * The API Resource provides a high-level description of an exposed API.
 * You can find more information, such as the API resource definitions, in the links in the table below.
 *
 * An API Resource bundles multiple endpoints and resources together.
 * They share the same API namespace and lifecycle (API major version).
 * However, the exact granularity of this is up to the implementer of the API.
 * As a consequence, an API resource MUST NOT bundle together endpoints from different API versions or namespaces.
 *
 * A common practice is to bundle endpoints that are based on the same domain or Business Object.
 *
 * Please note that APIs can be described, but still be [`disabled`](#api-resource_disabled).
 *
 * If the API is not created or owned by the user of the system or by third parties (like partners), it MUST be assigned to dedicated [Packages](#package) that state this the ownership via the `vendor` property.
 */
export interface APIResource {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Local ID, as known by the described system.
     */
    localId?: string;
    /**
     * Correlation IDs can be used to create a reference to related data in other repositories (especially to the system of record).
     *
     * MUST be a valid [Correlation ID](../index.md#correlation-id).
     */
    correlationIds?: string[];
    /**
     * Human-readable title.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    title: string;
    /**
     * Plain text short description.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    shortDescription: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description: string;
    /**
     * Defines which Package the resource is part of.
     *
     * MUST be a valid reference to a [Package](#package) ORD ID.
     *
     * Every resource MUST be part of one package.
     */
    partOfPackage: string;
    /**
     * List of references to the consumption bundles in this resource belongs to.
     *
     * MUST be a valid reference to a [Consumption Bundle](#consumption-bundle) ORD ID.
     *
     * An API resource SHOULD be associated to one or multiple consumption bundles, if it is of direction `inbound` or `mixed`.
     * Some ORD consumer use cases MAY depend on an association to a consumption bundle.
     * If none is given, the resource may not appear as it's unknown how it can be consumed.
     *
     * If a resource has no direct incoming consumption characteristics:
     * - MUST NOT assign consumption bundle to API or Event resources with `direction`: `outbound` (no inbound consumption)
     * - MUST NOT assign consumption bundle if resource is not accessible directly, but only via intermediaries like event brokers or gateways.
     *   - In this case the intermediary SHOULD describe the consumption bundle instead (potentially also re-describing the resources as well).
     */
    partOfConsumptionBundles?: ConsumptionBundleReference[];
    /**
     * References the default consumption bundle to use for this resource.
     *
     * MUST be a valid reference to a [Consumption Bundle](#consumption-bundle) ORD ID.
     *
     * Can be used by clients to make a deterministic and preferred choice when multiple options are available.
     *
     * The value MUST be an existing option in the corresponding `partOfConsumptionBundles` array.
     */
    defaultConsumptionBundle?: string;
    /**
     * List of products this resource is a part of.
     *
     * MUST be a valid reference to a [Product](#product) ORD ID.
     *
     * `partOfProducts` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     *
     * @minItems 0
     */
    partOfProducts?: string[];
    /**
     * The complete [SemVer](https://semver.org/) version string.
     *
     * It MUST follow the [Semantic Versioning 2.0.0](https://semver.org/) standard.
     * It SHOULD be changed if the ORD information or referenced resource definitions changed.
     * It SHOULD express minor and patch changes that don't lead to incompatible changes.
     *
     * When the `version` major version changes, the [ORD ID](#ord-id) `<majorVersion>` fragment MUST be updated to be identical.
     * In case that a resource definition file also contains a version number (e.g. [OpenAPI `info`.`version`](https://swagger.io/specification/#info-object)), it MUST be equal with the resource `version` to avoid inconsistencies.
     *
     * The general [Version and Lifecycle](../index.md#version-and-lifecycle) flow MUST be followed.
     *
     * Note: A change is only relevant for a version increment, if it affects the ORD resource or ORD taxonomy directly.
     * For example: If a resource within a `Package` changes, but the package itself did not, the package version does not need to be incremented.
     */
    version: string;
    /**
     * Optional, but RECOMMENDED indicator when (date-time) the last change to the resource (including its definitions) happened.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     *
     * In case that this property is available and the value of it hasn't changed since the last crawling, the resource definitions do not need to be fetched and updated.
     *
     * Together with `systemInstanceAware`, this property SHOULD be used to optimize the metadata crawling process of the ORD aggregators.
     */
    lastUpdate?: string;
    /**
     * The visibility/exposure of the described resource.
     * This indicates who is allowed to see (and implicitly also access) the described resource.
     */
    visibility: "public" | "internal" | "private";
    /**
     * The `releaseStatus` specifies the stability of the resource and its external contract.
     */
    releaseStatus: "active" | "beta" | "deprecated";
    /**
     * Indicates that this resource is currently not available for consumption at runtime, but could be configured to be so.
     * This can happen either because it has not been setup for use or disabled by an admin / user.
     *
     * If the resource is not available in principle for a particular system instance, e.g. due to lack of entitlement, it MUST not be described in the system-instance aware perspective.
     *
     * This only needs to reflect the knowledge of the described system instance itself,
     * meaning that outside factors don't need to be considered (e.g. network connectivity, middlewares).
     * This information may be of relevance for some ORD consumers that need to filter for active or disabled APIs.
     *
     * A disabled resource MAY skip describing its resource definitions.
     *
     */
    disabled?: boolean;
    /**
     * The deprecation date defines when the resource has been set as deprecated.
     * This is not to be confused with the `sunsetDate` which defines when the resource will be actually decommissioned / removed.
     *
     * If the `releaseStatus` is set to `deprecated`, the `deprecationDate` SHOULD be provided.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     */
    deprecationDate?: string;
    /**
     * The sunset date defines when the resource is scheduled to be decommissioned/removed.
     *
     * If the `releaseStatus` is set to `deprecated`, the `sunsetDate` MUST be provided.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     */
    sunsetDate?: string;
    /**
     * The successor resource(s).
     *
     * MUST be a valid reference to an [API Resource](#api-resource) ORD ID.
     *
     * If the `releaseStatus` is set to `deprecated`, `successors` MUST be provided if one exists.
     */
    successors?: string[];
    /**
     * Contains changelog entries that summarize changes with special regards to version and releaseStatus
     */
    changelogEntries?: ChangelogEntry[];
    /**
     * List of [URL reference](https://tools.ietf.org/html/rfc3986#section-4.1) (URL or relative reference) to the target host.
     *
     * If the API resource can be accessed through an entry point, it MUST be described here.
     *
     * The list of entry points MUST not include duplicates.
     * If multiple entry points are provided they MUST be arbitrarily exchangeable without effects.
     * This means that the URLs are just an alias to each other and the `resourceDefinitions` apply to all entry points equally.
     * In case of multiple entry points it is RECOMMENDED to provide a `defaultEntryPoint` through `partOfConsumptionBundles`.
     * The entry point URLs SHOULD match with the target host(s) in the resource definition files (e.g. OpenAPI `servers`).
     * If there is no match, the information in ORD takes precedence.
     *
     * **Provider View:**
     * If the URL is relative to the system that describes the ORD information,
     * it is RECOMMENDED to use relative references and (if known) to provide the `describedSystemInstance`.`baseUrl`.
     * If the URL is not relative to the described system instance [base URL](../index.md#def-base-url), a full URL MUST be provided.
     *
     * **Consumer View**:
     * When fetching the information from an ORD Aggregator, the consumer MAY rely on receiving full URLs.
     *
     * @minItems 0
     */
    entryPoints?: string[];
    /**
     * Direction of the API Resource consumption.
     * If not provided, "inbound" is assumed.
     *
     * In case of SOAP APIs, the direction is already indicated through the `apiProtocol`, making this property redundant and optional. But if it is provided, it MUST not be in contradiction with the `apiProtocol` direction.
     */
    direction?: "inbound" | "mixed" | "outbound";
    /**
     * API Protocol including the protocol version if applicable
     */
    apiProtocol: "odata-v2" | "odata-v4" | "rest" | "graphql" | "soap-inbound" | "soap-outbound" | "websocket" | "sap-rfc" | "sap-sql-api-v1";
    /**
     * List of available machine-readable resource definitions.
     *
     * It is RECOMMENDED to provide the resource definitions as they enable machine-readable use cases.
     * If resource definitions are added or changed, the `version` MUST be incremented.
     * An ORD aggregator MAY only (re)fetch the resource definitions again when the `version` was incremented.
     */
    resourceDefinitions?: APIResourceDefinition[];
    /**
     * Declares this API to be a valid implementation of a standardized or shared API contract.
     *
     * All APIs that share the same implementation standard MAY be treated the same by a consumer.
     * However, there MAY be differences in the API URLs, access strategy, and compatible customizations by the implementer.
     */
    implementationStandard?: "sap:ord-document-api:v1" | "cff:open-service-broker:v2" | "sap:csn-exposure:v1" | "sap:ape-api:v1" | "sap:cdi-api:v1" | "custom";
    /**
     * If the fixed `implementationStandard` values need to be extended, an arbitrary `customImplementationStandard` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `implementationStandard` is set to `custom`.
     */
    customImplementationStandard?: string;
    /**
     * Full description of the custom implementation standard, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     *
     * MUST only be provided if `implementationStandard` is set to `custom`.
     *
     * SHOULD contain documentation and links that describe the used standard.
     */
    customImplementationStandardDescription?: string;
    /**
     * List of use cases (types) how the resource is meant to be used for.
     *
     * This helps consumers better to understand which use cases had been in mind by the provider
     * and are therefore explicitly supported.
     *
     * If no array is defined, it is assumed that this information is not provided.
     */
    supportedUseCases?: (("mass-extraction" | "mass-import") & ("mass-extraction" | "mass-import"))[];
    /**
     * Describes mappings between the API Models of the described resource to the underlying, conceptual entity types.
     */
    entityTypeMappings?: EntityTypeMapping[];
    /**
     * Links with semantic meaning that are specific to API Resources.
     */
    apiResourceLinks?: APIAndEventResourceLink[];
    /**
     * Generic Links with arbitrary meaning and content.
     *
     * If applicable, `apiResourceLinks` MUST be used instead of generic `links`.
     */
    links?: Link[];
    extensible?: Extensible;
    /**
     * List of countries that the package resources are applicable to.
     *
     * MUST be expressed as an array of country codes according to [IES ISO-3166 ALPHA-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
     *
     * `countries` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    countries?: string[];
    /**
     * List of line of business tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * `lineOfBusiness` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    lineOfBusiness?: ((string | "Asset Management" | "Commerce" | "Finance" | "Human Resources" | "Manufacturing" | "Marketing" | "R&D Engineering" | "Sales" | "Service" | "Sourcing and Procurement" | "Supply Chain" | "Sustainability" | "Metering" | "Grid Operations and Maintenance" | "Plant Operations and Maintenance" | "Maintenance and Engineering") & string)[];
    /**
     * List of industry tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * `industry` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    industry?: ((string | "Aerospace and Defense" | "Automotive" | "Banking" | "Chemicals" | "Consumer Products" | "Defense and Security" | "Engineering Construction and Operations" | "Healthcare" | "Higher Education and Research" | "High Tech" | "Industrial Machinery and Components" | "Insurance" | "Life Sciences" | "Media" | "Mill Products" | "Mining" | "Oil and Gas" | "Professional Services" | "Public Sector" | "Retail" | "Sports and Entertainment" | "Telecommunications" | "Travel and Transportation" | "Utilities" | "Wholesale Distribution") & string)[];
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
    /**
     * The [policy level](../../spec-extensions/access-strategies/) (aka. compliance level) that this ORD Document or part of it needs to be compliant with.
     * Depending on the chosen policy level, certain expectations and validations rules will be applied.
     *
     * The policy level can be defined on ORD Document level, but also be overwritten on an individual package or resource level.
     *
     * If not provided, no additional policy level expectations and validations apply.
     *
     */
    policyLevel?: "none" | "sap:core:v1" | "custom";
    /**
     * If the fixed `policyLevel` values need to be extended, an arbitrary `customPolicyLevel` can be provided.
     *
     * The policy level is inherited from packages to resources they contain, but can be overwritten at resource level.
     *
     * MUST only be provided if `policyLevel` is set to `custom`.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     */
    customPolicyLevel?: string;
    /**
     * Defines whether this ORD resource is **system instance aware**.
     * This is the case (and relevant) when the referenced resource definitions are potentially different between **system instances**.
     *
     * If this behavior applies, `systemInstanceAware` MUST be set to true.
     * An ORD aggregator that represents a system instance aware perspective MUST fetch the referenced resource definitions,
     * not just once per system type, but once per **system instance**.
     */
    systemInstanceAware?: boolean;
}
/**
 * Reference to a Consumption bundle.
 *
 * This is a complex object to allow additional properties / selections to be attached.
 */
export interface ConsumptionBundleReference {
    /**
     * The consumption bundle ORD ID (`ConsumptionBundle.ordId`) this reference points to.
     */
    ordId: string;
    /**
     * In case that an API Resource has multiple entry points, this will indicate which entry point should be used by default
     * when discovering this resource from the context of the referenced Consumption Bundle.
     *
     * MUST NOT be provided for Event Resources, as they don't have entry points.
     * MUST only be provided if the resource has more than one entry point.
     * MUST be in the list of `entryPoints` of the affected resource.
     */
    defaultEntryPoint?: string;
}
/**
 * A changelog entry can be used to indicate changes.
 * Usually they lead to a change of the version number or the release status.
 */
export interface ChangelogEntry {
    /**
     * Full version number that corresponds to the `version` that is described by the changelog entry.
     *
     * Ideally it follows the [Semantic Versioning 2.0.0](https://semver.org/) standard,
     * but since it should reflect the actual version string / scheme used, this is not a mandatory requirement.
     */
    version: string;
    /**
     * The `releaseStatus` specifies the stability of the resource and its external contract.
     */
    releaseStatus: "active" | "beta" | "deprecated";
    /**
     * Date of change, without time or timezone information.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     */
    date: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description?: string;
    /**
     * Optional [URL](https://tools.ietf.org/html/rfc3986) that links to a more detailed changelog entry.
     */
    url?: string;
}
/**
 * Link and categorization of a machine-readable API definition.
 * For example, OpenAPI definition, OData Metadata, etc.
 */
export interface APIResourceDefinition {
    /**
     * Type of the API Resource Definition
     * If "custom" is chosen, a customType MUST be provided
     */
    type: "openapi-v2" | "openapi-v3" | "raml-v1" | "edmx" | "csdl-json" | "graphql-sdl" | "wsdl-v1" | "wsdl-v2" | "sap-rfc-metadata-v1" | "sap-sql-api-definition-v1" | "custom";
    /**
     * If the fixed `type` enum values need to be extended, an arbitrary `customType` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customType?: string;
    /**
     * The [Media Type](https://www.iana.org/assignments/media-types/media-types.xhtml) of the definition serialization format.
     * A consuming application can use this information to know which file format parser it needs to use.
     * For example, for OpenAPI 3, it's valid to express the same definition in both YAML and JSON.
     *
     * If no Media Type is registered for the referenced file,
     * `text/plain` MAY be used for arbitrary plain-text and `application/octet-stream` for arbitrary binary data.
     *
     */
    mediaType: "application/json" | "application/xml" | "text/yaml" | "text/plain" | "application/octet-stream";
    /**
     * [URL reference](https://tools.ietf.org/html/rfc3986#section-4.1) (URL or relative reference) to the resource definition file.
     *
     * It is RECOMMENDED to provide a relative URL (to base URL), starting with `/`.
     */
    url: string;
    /**
     * List of supported access strategies for retrieving metadata from the ORD provider.
     *
     * An ORD Consumer/ORD Aggregator MAY choose any of the strategies.
     *
     * @minItems 1
     */
    accessStrategies: [AccessStrategy, ...AccessStrategy[]];
}
/**
 * Defines the [access strategy](../../spec-extensions/access-strategies/) for accessing the resource definitions.
 */
export interface AccessStrategy {
    /**
     * Defines the authentication/authorization strategy through which the referenced `resourceDefinitions` are accessible.
     */
    type: "open" | "sap:cmp-mtls:v1" | "sap.businesshub:basic-auth:v1" | "custom";
    /**
     * If the fixed `type` enum values need to be extended, an arbitrary `customType` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customType?: string;
    /**
     * Human-readable description about how the access is set up, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customDescription?: string;
}
/**
 * An API or Event resource may optionally define its `entityTypeMappings`.
 * This is used to map and correlate the API models to the underlying, conceptual **entity types**.
 *
 * If the mapping from API resource to entity types is not defined,
 * certain use-cases that rely on this explicit connection will not be possible.
 *
 * This mapping is meant to be rather fine granular.
 * Therefore, the mapping needs to be done on basis of one of the referenced resource definitions,
 * as only there we know the details and the actual contents of the API Model of the API resource.
 *
 * For the various resource definition formats the selection of API models may need to be expressed differently.
 * As a consequence, there are different types of selectors that are specialized toward certain resource definition formats.
 *
 * The target of the mapping is a correlation to an entity type via a [Correlation ID](https://sap.github.io/open-resource-discovery/#/v1/README?id=correlation-id)
 * or to an [ORD ID] of an entity type.
 * It is assumed that the entity types are described in more detail or on a different abstraction level via metadata.
 * When the correlation ID is used, an ORD consumer may need to know how to access the entity type metadata through conventions.
 * This can be determined either by the namespace of the correlation ID,
 * or through a defined and known `implementationStandard` that can resolve the `localId` fragment of the correlation ID .
 *
 * At SAP, the metadata about entity types could be retrieved via the CSN_EXPOSURE service.
 * To indicate this, the service needs to be implemented and described in ORD with `implementationStandard` set to `sap:csn-exposure:v1`).
 *
 * ODM 2.0 relies on the entity type mappings and uses the the mapping to express the relationship of an API to the
 * corresponding ODM entity. ORD consumers like SAP Business Accelerator Hub consume the mapping to make the relationships navigatable for customers.
 */
export interface EntityTypeMapping {
    /**
     * List of selectors for API models within an API Resource.
     * If multiple selectors are given, every selected API model maps to the entity type target(s).
     * If omitted, the complete API resource will be mapped to the `entityTypeTargets` (less specific).
     *
     * Multiple selectors can be useful, e.g. with a CRUD REST API, to combine the similar API models.
     *
     * Depending on the chosen API protocol and the available resource definition formats,
     * different kind of selectors need to be used.
     */
    apiModelSelectors?: (APIModelSelectorOData | APIModelSelectorJSONPointer)[];
    /**
     * List of entity types the ORD resource maps to.
     * If `apiModelSelectors` are given, the mapping is more precise by also pointing to the specific model in the API.
     *
     * If multiple entity types are defined as the mapping target,
     * all of them can be at least partially mapped to the source API model(s).
     *
     * Entity types can be referenced using either using an [ORD ID](https://sap.github.io/open-resource-discovery/spec-v1/#ord-id) or a [Correlation ID](https://sap.github.io/open-resource-discovery/spec-v1/#correlation-id).
     *
     * @minItems 1
     */
    entityTypeTargets: [
        EntityTypeTargetORDID | EntityTypeTargetCorrelationID,
        ...(EntityTypeTargetORDID | EntityTypeTargetCorrelationID)[]
    ];
}
/**
 * API Model Selector for OData, using entity set names for the selection.
 *
 * MUST only be used if the API Resource provides an API Resource Definition of type `edmx`.
 */
export interface APIModelSelectorOData {
    /**
     * The type for OData selectors is fixed to `odata`.
     */
    type: "odata";
    /**
     * OData entity set name.
     *
     * As defined in the EDMX, e.g. `<EntitySet Name="AttachmentContent">`.
     */
    entitySetName: string;
}
/**
 * Generic API Model Selector for JSON / YAML based resource definitions.
 * It uses a [JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901) that points to the
 * entity type description within the resource definition.
 *
 * The JSON Pointer always to refer to the structure of the document as originally provided, before further post-processing like resolving $ref properties.
 *
 * MUST only be used if the API Resource provides an API Resource Definition of media type `application/json` or `text/yaml`.
 */
export interface APIModelSelectorJSONPointer {
    /**
     * The type for generic JSON Pointer selectors is fixed to `json-pointer`.
     */
    type: "json-pointer";
    /**
     * JSON Pointer to the entity type schema / description within the resource definition format.
     *
     * MUST be a valid JSON Pointer according to [RFC6901](https://datatracker.ietf.org/doc/html/rfc6901).
     *
     * The JSON pointers MUST point to each instance of the mapped entity type in the resource definition file, BEFORE `$ref` JSON Schema References are resolved (dereferenced).
     */
    jsonPointer: string;
}
/**
 * Define which entity type is the target of an entity type mapping
 *
 * Entity types can be referenced using a [ORD ID](https://sap.github.io/open-resource-discovery/spec-v1/#ord-id) of an entity type.
 */
export interface EntityTypeTargetORDID {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
}
/**
 * Define which entity type is the target of an entity type mapping
 *
 * Entity types can be referenced using a [Correlation ID](https://sap.github.io/open-resource-discovery/spec-v1/#correlation-id).
 */
export interface EntityTypeTargetCorrelationID {
    correlationId: string;
}
/**
 * Links with specific semantic meaning that are related to API or event resources.
 *
 * If a generic `Link` can also be expressed via an `APIEventResourceLink`, the latter MUST be chosen.
 */
export interface APIAndEventResourceLink {
    /**
     * See also: [WADG0001 WebAPI type extension](https://webapi-discovery.github.io/rfcs/rfc0001.html#webapiactions)
     */
    type: "api-documentation" | "authentication" | "client-registration" | "console" | "payment" | "service-level-agreement" | "support" | "custom";
    /**
     * If the fixed `type` enum values need to be extended, an arbitrary `customType` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customType?: string;
    /**
     * [URL reference](https://tools.ietf.org/html/rfc3986#section-4.1) (URL or relative reference) to the endpoint or UI for the action.
     *
     * If the link is relative to base URL, it is RECOMMENDED to provide a relative URL to it, starting with `/`.
     */
    url: string;
}
/**
 * Link that can be attached to packages or Open Resource Discovery resources.
 *
 */
export interface Link {
    /**
     * Human readable title of the link.
     *
     * MUST be unique within the collection of links provided.
     */
    title: string;
    /**
     * [URL](https://tools.ietf.org/html/rfc3986) of the link.
     */
    url: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown)
     */
    description?: string;
    [k: string]: any | undefined;
}
/**
 * Contains information about the extensibility of this resource.
 *
 * If applicable, a description and further resources about extending this resource are provided.
 */
export interface Extensible {
    /**
     * This property defines whether the resource is extensible.
     *
     * **Not extensible** means that the data model of the resource (i.e. API or event) cannot be extended with custom fields.
     * **Manually extensible** means that in addition to defining a custom field, manual activities to include the field in the data model of the resource (i.e. API or event) are required. E.g. using a specific mapping tool or by selecting the resource in the data model extension tool.
     * **Automatically extensible** means that after defining a custom field in the local domain model, the resource (i.e. API or event) is automatically extended as part of the default extension field definition.
     */
    supported: "no" | "manual" | "automatic";
    /**
     * A description about the extensibility capabilities of this API, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     *
     * This description may contain detailed steps on how to extend the API.
     * Links to external resources can be provided within the description as markdown links.
     *
     * This description MUST be provided if `supported` is set to `manual` or `automatic`.
     */
    description?: string;
}
/**
 * The event resource provides a high-level description of a collection of related Events. More detailed information, such as the event resource definitions, are provided in links in the table below.
 * Which events are considered "related" is up to the implementer. A common practice is to bundle events that are based on the same resource/Business Object. It is also an option to bundle all available events into a single event resource/event catalog.
 * Please note that event resources can be described, but still be [`disabled`](#event-resource_disabled).
 * If the event resource is not created or owned by the user / customer of the system or by partners / third parties, it MUST be assigned to dedicated [Packages](#package) that state this the ownership via the `vendor` property.
 */
export interface EventResource {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Local ID, as known by the described system.
     */
    localId?: string;
    /**
     * Correlation IDs can be used to create a reference to related data in other repositories (especially to the system of record).
     *
     * MUST be a valid [Correlation ID](../index.md#correlation-id).
     */
    correlationIds?: string[];
    /**
     * Human-readable title.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    title: string;
    /**
     * Plain text short description.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    shortDescription: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description: string;
    /**
     * Defines which Package the resource is part of.
     *
     * MUST be a valid reference to a [Package](#package) ORD ID.
     *
     * Every resource MUST be part of one package.
     */
    partOfPackage: string;
    /**
     * List of references to the consumption bundles in this resource belongs to.
     *
     * MUST be a valid reference to a [Consumption Bundle](#consumption-bundle) ORD ID.
     *
     * An API resource SHOULD be associated to one or multiple consumption bundles, if it is of direction `inbound` or `mixed`.
     * Some ORD consumer use cases MAY depend on an association to a consumption bundle.
     * If none is given, the resource may not appear as it's unknown how it can be consumed.
     *
     * If a resource has no direct incoming consumption characteristics:
     * - MUST NOT assign consumption bundle to API or Event resources with `direction`: `outbound` (no inbound consumption)
     * - MUST NOT assign consumption bundle if resource is not accessible directly, but only via intermediaries like event brokers or gateways.
     *   - In this case the intermediary SHOULD describe the consumption bundle instead (potentially also re-describing the resources as well).
     */
    partOfConsumptionBundles?: ConsumptionBundleReference[];
    /**
     * References the default consumption bundle to use for this resource.
     *
     * MUST be a valid reference to a [Consumption Bundle](#consumption-bundle) ORD ID.
     *
     * Can be used by clients to make a deterministic and preferred choice when multiple options are available.
     *
     * The value MUST be an existing option in the corresponding `partOfConsumptionBundles` array.
     */
    defaultConsumptionBundle?: string;
    /**
     * List of products this resource is a part of.
     *
     * MUST be a valid reference to a [Product](#product) ORD ID.
     *
     * `partOfProducts` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     *
     * @minItems 0
     */
    partOfProducts?: string[];
    /**
     * The complete [SemVer](https://semver.org/) version string.
     *
     * It MUST follow the [Semantic Versioning 2.0.0](https://semver.org/) standard.
     * It SHOULD be changed if the ORD information or referenced resource definitions changed.
     * It SHOULD express minor and patch changes that don't lead to incompatible changes.
     *
     * When the `version` major version changes, the [ORD ID](#ord-id) `<majorVersion>` fragment MUST be updated to be identical.
     * In case that a resource definition file also contains a version number (e.g. [OpenAPI `info`.`version`](https://swagger.io/specification/#info-object)), it MUST be equal with the resource `version` to avoid inconsistencies.
     *
     * The general [Version and Lifecycle](../index.md#version-and-lifecycle) flow MUST be followed.
     *
     * Note: A change is only relevant for a version increment, if it affects the ORD resource or ORD taxonomy directly.
     * For example: If a resource within a `Package` changes, but the package itself did not, the package version does not need to be incremented.
     */
    version: string;
    /**
     * Optional, but RECOMMENDED indicator when (date-time) the last change to the resource (including its definitions) happened.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     *
     * In case that this property is available and the value of it hasn't changed since the last crawling, the resource definitions do not need to be fetched and updated.
     *
     * Together with `systemInstanceAware`, this property SHOULD be used to optimize the metadata crawling process of the ORD aggregators.
     */
    lastUpdate?: string;
    /**
     * The visibility/exposure of the described resource.
     * This indicates who is allowed to see (and implicitly also access) the described resource.
     */
    visibility: "public" | "internal" | "private";
    /**
     * The `releaseStatus` specifies the stability of the resource and its external contract.
     */
    releaseStatus: "active" | "beta" | "deprecated";
    /**
     * Indicates that this resource is currently not available for consumption at runtime, but could be configured to be so.
     * This can happen either because it has not been setup for use or disabled by an admin / user.
     *
     * If the resource is not available in principle for a particular system instance, e.g. due to lack of entitlement, it MUST not be described in the system-instance aware perspective.
     *
     * This only needs to reflect the knowledge of the described system instance itself,
     * meaning that outside factors don't need to be considered (e.g. network connectivity, middlewares).
     * This information may be of relevance for some ORD consumers that need to filter for active or disabled APIs.
     *
     * A disabled resource MAY skip describing its resource definitions.
     *
     */
    disabled?: boolean;
    /**
     * The deprecation date defines when the resource has been set as deprecated.
     * This is not to be confused with the `sunsetDate` which defines when the resource will be actually decommissioned / removed.
     *
     * If the `releaseStatus` is set to `deprecated`, the `deprecationDate` SHOULD be provided.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     */
    deprecationDate?: string;
    /**
     * The sunset date defines when the resource is scheduled to be decommissioned/removed.
     *
     * If the `releaseStatus` is set to `deprecated`, the `sunsetDate` MUST be provided.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     */
    sunsetDate?: string;
    /**
     * The successor resource(s).
     *
     * MUST be a valid reference to an [API Resource](#api-resource) ORD ID.
     *
     * If the `releaseStatus` is set to `deprecated`, `successors` MUST be provided if one exists.
     */
    successors?: string[];
    /**
     * Contains changelog entries that summarize changes with special regards to version and releaseStatus
     */
    changelogEntries?: ChangelogEntry[];
    /**
     * List of available machine-readable resource definitions.
     *
     * It is RECOMMENDED to provide resource definitions (if applicable) as they enable machine-readable use cases.
     * If resource definitions are added or changed, the `version` MUST be incremented.
     * An ORD aggregator MAY only (re)fetch the resource definitions again when the `version` was incremented.
     */
    resourceDefinitions?: EventResourceDefinition[];
    /**
     * Declares this EventResource to be a valid implementation of a standardized or shared contract.
     *
     * All implementations of the same implementation standard MAY be treated the same by a consumer.
     * However, there MAY be differences in the access strategy, and compatible customizations by the implementer.
     * The implementation standard MAY define the role of the implementor (producer, consumer, both) and how it is determined.
     *
     * As of now, only custom implementation standards are supported.
     */
    implementationStandard?: "custom";
    /**
     * If the fixed `implementationStandard` values need to be extended, an arbitrary `customImplementationStandard` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `implementationStandard` is set to `custom`.
     */
    customImplementationStandard?: string;
    /**
     * Full description of the custom implementation standard, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     *
     * MUST only be provided if `implementationStandard` is set to `custom`.
     *
     * SHOULD contain documentation and links that describe the used standard.
     */
    customImplementationStandardDescription?: string;
    /**
     * Describes mappings between the API Models of the described resource to the underlying, conceptual entity types.
     */
    entityTypeMappings?: EntityTypeMapping[];
    /**
     * Links with semantic meaning that are specific to event resources.
     *
     * If applicable, `eventResourceLinks` MUST be used instead of generic `links`.
     */
    eventResourceLinks?: APIAndEventResourceLink[];
    /**
     * Generic Links with arbitrary meaning and content.
     */
    links?: Link[];
    extensible?: Extensible;
    /**
     * List of countries that the package resources are applicable to.
     *
     * MUST be expressed as an array of country codes according to [IES ISO-3166 ALPHA-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
     *
     * `countries` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    countries?: string[];
    /**
     * List of line of business tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * `lineOfBusiness` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    lineOfBusiness?: ((string | "Asset Management" | "Commerce" | "Finance" | "Human Resources" | "Manufacturing" | "Marketing" | "R&D Engineering" | "Sales" | "Service" | "Sourcing and Procurement" | "Supply Chain" | "Sustainability" | "Metering" | "Grid Operations and Maintenance" | "Plant Operations and Maintenance" | "Maintenance and Engineering") & string)[];
    /**
     * List of industry tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * `industry` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    industry?: ((string | "Aerospace and Defense" | "Automotive" | "Banking" | "Chemicals" | "Consumer Products" | "Defense and Security" | "Engineering Construction and Operations" | "Healthcare" | "Higher Education and Research" | "High Tech" | "Industrial Machinery and Components" | "Insurance" | "Life Sciences" | "Media" | "Mill Products" | "Mining" | "Oil and Gas" | "Professional Services" | "Public Sector" | "Retail" | "Sports and Entertainment" | "Telecommunications" | "Travel and Transportation" | "Utilities" | "Wholesale Distribution") & string)[];
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
    /**
     * The [policy level](../../spec-extensions/access-strategies/) (aka. compliance level) that this ORD Document or part of it needs to be compliant with.
     * Depending on the chosen policy level, certain expectations and validations rules will be applied.
     *
     * The policy level can be defined on ORD Document level, but also be overwritten on an individual package or resource level.
     *
     * If not provided, no additional policy level expectations and validations apply.
     *
     */
    policyLevel?: "none" | "sap:core:v1" | "custom";
    /**
     * If the fixed `policyLevel` values need to be extended, an arbitrary `customPolicyLevel` can be provided.
     *
     * The policy level is inherited from packages to resources they contain, but can be overwritten at resource level.
     *
     * MUST only be provided if `policyLevel` is set to `custom`.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     */
    customPolicyLevel?: string;
    /**
     * Defines whether this ORD resource is **system instance aware**.
     * This is the case (and relevant) when the referenced resource definitions are potentially different between **system instances**.
     *
     * If this behavior applies, `systemInstanceAware` MUST be set to true.
     * An ORD aggregator that represents a system instance aware perspective MUST fetch the referenced resource definitions,
     * not just once per system type, but once per **system instance**.
     */
    systemInstanceAware?: boolean;
}
/**
 * Link and categorization of a machine-readable API definition.
 * For example, AsyncAPI or OpenAPI with callbacks, etc.
 */
export interface EventResourceDefinition {
    /**
     * Type of the event resource definition
     */
    type: "asyncapi-v2" | "custom";
    /**
     * If the fixed `type` enum values need to be extended, an arbitrary `customType` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customType?: string;
    /**
     * The [Media Type](https://www.iana.org/assignments/media-types/media-types.xhtml) of the definition serialization format.
     * A consuming application can use this information to know which file format parser it needs to use.
     * For example, for OpenAPI 3, it's valid to express the same definition in both YAML and JSON.
     *
     * If no Media Type is registered for the referenced file,
     * `text/plain` MAY be used for arbitrary plain-text and `application/octet-stream` for arbitrary binary data.
     *
     */
    mediaType: "application/json" | "application/xml" | "text/yaml" | "text/plain" | "application/octet-stream";
    /**
     * [URL reference](https://tools.ietf.org/html/rfc3986#section-4.1) (URL or relative reference) to the resource definition file.
     *
     * It is RECOMMENDED to provide a relative URL (to base URL), starting with `/`.
     */
    url: string;
    /**
     * List of supported access strategies for retrieving metadata from the ORD provider.
     *
     * An ORD Consumer/ORD Aggregator MAY choose any of the strategies.
     *
     * @minItems 1
     */
    accessStrategies: [AccessStrategy, ...AccessStrategy[]];
}
/**
 * An entity type ideally describes an underlying conceptual model that is then exposed through one or multiple API and events resources.
 * It is a well-defined named abstract concept in SAP software representing a data model and behavioral model of a concrete business or technical entity.
 *
 * The most known example for entity types are the [SAP Object Types (SOTs)](https://ui.gtnc.sap.corp/webapp/index.html#/SAPObjectTypes//OneColumn//TilePress) of VDM and the [ODM Entities](https://ui.gtnc.sap.corp/webapp/index.html#/ODMEntities//OneColumn//TilePress).
 */
export interface EntityType {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Local ID, as known by the described system.
     */
    localId: string;
    /**
     * Correlation IDs can be used to create a reference to related data in other repositories (especially to the system of record).
     *
     * MUST be a valid [Correlation ID](../index.md#correlation-id).
     */
    correlationIds?: string[];
    /**
     * Human-readable title.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    title: string;
    /**
     * Plain text short description.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    shortDescription?: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description?: string;
    /**
     * Defines which Package the resource is part of.
     *
     * MUST be a valid reference to a [Package](#package) ORD ID.
     *
     * Every resource MUST be part of one package.
     */
    partOfPackage: string;
    /**
     * List of products this resource is a part of.
     *
     * MUST be a valid reference to a [Product](#product) ORD ID.
     *
     * `partOfProducts` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     *
     * @minItems 0
     */
    partOfProducts?: string[];
    /**
     * The complete [SemVer](https://semver.org/) version string.
     *
     * It MUST follow the [Semantic Versioning 2.0.0](https://semver.org/) standard.
     * It SHOULD be changed if the ORD information or referenced resource definitions changed.
     * It SHOULD express minor and patch changes that don't lead to incompatible changes.
     *
     * When the `version` major version changes, the [ORD ID](#ord-id) `<majorVersion>` fragment MUST be updated to be identical.
     * In case that a resource definition file also contains a version number (e.g. [OpenAPI `info`.`version`](https://swagger.io/specification/#info-object)), it MUST be equal with the resource `version` to avoid inconsistencies.
     *
     * The general [Version and Lifecycle](../index.md#version-and-lifecycle) flow MUST be followed.
     *
     * Note: A change is only relevant for a version increment, if it affects the ORD resource or ORD taxonomy directly.
     * For example: If a resource within a `Package` changes, but the package itself did not, the package version does not need to be incremented.
     */
    version: string;
    /**
     * Optional, but RECOMMENDED indicator when (date-time) the last change to the resource (including its definitions) happened.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     *
     * In case that this property is available and the value of it hasn't changed since the last crawling, the resource definitions do not need to be fetched and updated.
     *
     * Together with `systemInstanceAware`, this property SHOULD be used to optimize the metadata crawling process of the ORD aggregators.
     */
    lastUpdate?: string;
    /**
     * The visibility/exposure of the described resource.
     * This indicates who is allowed to see (and implicitly also access) the described resource.
     */
    visibility: "public" | "internal" | "private";
    /**
     * The `releaseStatus` specifies the stability of the resource and its external contract.
     */
    releaseStatus: "active" | "beta" | "deprecated";
    /**
     * The deprecation date defines when the resource has been set as deprecated.
     * This is not to be confused with the `sunsetDate` which defines when the resource will be actually decommissioned / removed.
     *
     * If the `releaseStatus` is set to `deprecated`, the `deprecationDate` SHOULD be provided.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     */
    deprecationDate?: string;
    /**
     * The sunset date defines when the resource is scheduled to be decommissioned/removed.
     *
     * If the `releaseStatus` is set to `deprecated`, the `sunsetDate` MUST be provided.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     */
    sunsetDate?: string;
    /**
     * The successor resource(s).
     *
     * MUST be a valid reference to an [API Resource](#api-resource) ORD ID.
     *
     * If the `releaseStatus` is set to `deprecated`, `successors` MUST be provided if one exists.
     */
    successors?: string[];
    /**
     * Contains changelog entries that summarize changes with special regards to version and releaseStatus
     */
    changelogEntries?: ChangelogEntry[];
    /**
     * Defining the abstraction level of the entity type using the DDD terminology.
     *
     * In Domain-Driven Design, there is a concept of entities and aggregates. There are root entities which may contain
     * further sub entities by composition. The complete “package” is then called an aggregate, which gets its name and identity
     * from the root entity.  An aggregate is a cluster of domain objects that can be treated as a single unit.  The root
     * is the entity that is referenced from outside the aggregate. There must be only one root per aggregate. The root
     * ensures the integrity of the aggregate. A sub entity is any other non-root entity in the aggregate. Source, see
     * [Martin Fowler on DDD Aggregate](https://martinfowler.com/bliki/DDD_Aggregate.html)
     *
     * For now, we decided to only cover the aggregate level, which is described in the enum value.
     */
    level: "aggregate";
    /**
     * Generic Links with arbitrary meaning and content.
     */
    links?: Link[];
    extensible?: Extensible;
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
    /**
     * The [policy level](../../spec-extensions/access-strategies/) (aka. compliance level) that this ORD Document or part of it needs to be compliant with.
     * Depending on the chosen policy level, certain expectations and validations rules will be applied.
     *
     * The policy level can be defined on ORD Document level, but also be overwritten on an individual package or resource level.
     *
     * If not provided, no additional policy level expectations and validations apply.
     *
     */
    policyLevel?: "none" | "sap:core:v1" | "custom";
    /**
     * If the fixed `policyLevel` values need to be extended, an arbitrary `customPolicyLevel` can be provided.
     *
     * The policy level is inherited from packages to resources they contain, but can be overwritten at resource level.
     *
     * MUST only be provided if `policyLevel` is set to `custom`.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     */
    customPolicyLevel?: string;
    /**
     * Defines whether this ORD resource is **system instance aware**.
     * This is the case (and relevant) when the referenced resource definitions are potentially different between **system instances**.
     *
     * If this behavior applies, `systemInstanceAware` MUST be set to true.
     * An ORD aggregator that represents a system instance aware perspective MUST fetch the referenced resource definitions,
     * not just once per system type, but once per **system instance**.
     */
    systemInstanceAware?: boolean;
}
/**
 * Capabilities can be used to describe use case specific capabilities, most notably supported features or additional information (like configuration) that needs to be understood from outside.
 * This is a generic ORD concept that aims to cover many different capability discovery use cases that would otherwise need be implemented as individual service provider interfaces (SPIs).
 *
 * If a capability needs to expose more information than possible with generic capability properties, a custom capability definition can be defined and referenced in ORD.
 * This is the same idea and mechanism as with API resources and their resource definition formats.
 */
export interface Capability {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Local ID, as known by the described system.
     */
    localId?: string;
    /**
     * Correlation IDs can be used to create a reference to related data in other repositories (especially to the system of record).
     *
     * MUST be a valid [Correlation ID](../index.md#correlation-id).
     */
    correlationIds?: string[];
    /**
     * Type of the Capability
     */
    type: "custom" | "sap.mdo:mdi-capability:v1";
    /**
     * If the fixed `type` enum values need to be extended, an arbitrary `customType` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customType?: string;
    /**
     * Human-readable title.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    title: string;
    /**
     * Plain text short description.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    shortDescription?: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description?: string;
    /**
     * Defines which Package the resource is part of.
     *
     * MUST be a valid reference to a [Package](#package) ORD ID.
     *
     * Every resource MUST be part of one package.
     */
    partOfPackage: string;
    /**
     * The complete [SemVer](https://semver.org/) version string.
     *
     * It MUST follow the [Semantic Versioning 2.0.0](https://semver.org/) standard.
     * It SHOULD be changed if the ORD information or referenced resource definitions changed.
     * It SHOULD express minor and patch changes that don't lead to incompatible changes.
     *
     * When the `version` major version changes, the [ORD ID](#ord-id) `<majorVersion>` fragment MUST be updated to be identical.
     * In case that a resource definition file also contains a version number (e.g. [OpenAPI `info`.`version`](https://swagger.io/specification/#info-object)), it MUST be equal with the resource `version` to avoid inconsistencies.
     *
     * The general [Version and Lifecycle](../index.md#version-and-lifecycle) flow MUST be followed.
     *
     * Note: A change is only relevant for a version increment, if it affects the ORD resource or ORD taxonomy directly.
     * For example: If a resource within a `Package` changes, but the package itself did not, the package version does not need to be incremented.
     */
    version: string;
    /**
     * Optional, but RECOMMENDED indicator when (date-time) the last change to the resource (including its definitions) happened.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     *
     * In case that this property is available and the value of it hasn't changed since the last crawling, the resource definitions do not need to be fetched and updated.
     *
     * Together with `systemInstanceAware`, this property SHOULD be used to optimize the metadata crawling process of the ORD aggregators.
     */
    lastUpdate?: string;
    /**
     * The visibility/exposure of the described resource.
     * This indicates who is allowed to see (and implicitly also access) the described resource.
     */
    visibility: "public" | "internal" | "private";
    /**
     * The `releaseStatus` specifies the stability of the resource and its external contract.
     */
    releaseStatus: "active" | "beta" | "deprecated";
    /**
     * Optional list of related EntityType Resources.
     *
     * MUST be a valid reference to an [EntityType Resource](#entity-type) ORD ID.
     */
    relatedEntityTypes?: string[];
    /**
     * List of available machine-readable capability definitions.
     *
     * If capability definitions are added or changed, the `version` SHOULD be incremented and `lastUpdate` be updated.
     */
    definitions?: CapabilityDefinition[];
    /**
     * Generic Links with arbitrary meaning and content.
     */
    links?: Link[];
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
    /**
     * Defines whether this ORD resource is **system instance aware**.
     * This is the case (and relevant) when the referenced resource definitions are potentially different between **system instances**.
     *
     * If this behavior applies, `systemInstanceAware` MUST be set to true.
     * An ORD aggregator that represents a system instance aware perspective MUST fetch the referenced resource definitions,
     * not just once per system type, but once per **system instance**.
     */
    systemInstanceAware?: boolean;
}
/**
 * Link and categorization of a machine-readable capability definition.
 */
export interface CapabilityDefinition {
    /**
     * Type of the capability resource definition
     */
    type: "custom" | "sap.mdo:mdi-capability-definition:v1";
    /**
     * If the fixed `type` enum values need to be extended, an arbitrary `customType` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customType?: string;
    /**
     * The [Media Type](https://www.iana.org/assignments/media-types/media-types.xhtml) of the definition serialization format.
     * A consuming application can use this information to know which file format parser it needs to use.
     * For example, for OpenAPI 3, it's valid to express the same definition in both YAML and JSON.
     *
     * If no Media Type is registered for the referenced file,
     * `text/plain` MAY be used for arbitrary plain-text and `application/octet-stream` for arbitrary binary data.
     *
     */
    mediaType: "application/json" | "application/xml" | "text/yaml" | "text/plain" | "application/octet-stream";
    /**
     * [URL reference](https://tools.ietf.org/html/rfc3986#section-4.1) (URL or relative reference) to the resource definition file.
     *
     * It is RECOMMENDED to provide a relative URL (to base URL), starting with `/`.
     */
    url: string;
    /**
     * List of supported access strategies for retrieving metadata from the ORD provider.
     *
     * An ORD Consumer/ORD Aggregator MAY choose any of the strategies.
     *
     * @minItems 1
     */
    accessStrategies: [AccessStrategy, ...AccessStrategy[]];
}
/**
 * An [Integration Dependency](../../details/articles/integration-dependency) states that the described system (self) can integrate with external systems (integration target) to achieve an integration purpose.
 * The purpose could be to enable a certain feature or integration scenario, but it could also be a mandatory prerequisite for the described system to work.
 *
 * The integration dependency includes a list of individual **aspects** that the integration consists of.
 * Each aspect can express alternatives (OR condition) on what  API and event resources can be used to achieve the same outcome.
 *
 * The direction of connection establishment, data flow is not directly implied and needs to be inferred from the referenced resources.
 *
 * It is not in scope for the Integration Dependency to describe scenarios that external consumers have with the own exposed resources.
 * This would overstep the boundary of self-description.
 *
 * If an integration scenario consists of two sides integration with each other, each need to describe its own part in it as an Integration Dependency.
 * Therefore, if an integration with multiple types of systems need to be setup, this SHOULD be separated into distinct Integration Dependencies.
 *
 * An integration dependency is also not meant to describe a bigger process.
 * Instead it focuses on the technical necessaries to create an integration for one particular purpose.
 *
 * For more details, see [Integration Dependency](../../details/articles/integration-dependency).
 */
export interface IntegrationDependency {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Local ID, as known by the described system.
     */
    localId?: string;
    /**
     * Correlation IDs can be used to create a reference to related data in other repositories (especially to the system of record).
     *
     * MUST be a valid [Correlation ID](../index.md#correlation-id).
     */
    correlationIds?: string[];
    /**
     * Human-readable title.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    title: string;
    /**
     * Plain text short description.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    shortDescription?: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description?: string;
    /**
     * Defines which Package the resource is part of.
     *
     * MUST be a valid reference to a [Package](#package) ORD ID.
     *
     * Every resource MUST be part of one package.
     */
    partOfPackage: string;
    /**
     * The complete [SemVer](https://semver.org/) version string.
     *
     * It MUST follow the [Semantic Versioning 2.0.0](https://semver.org/) standard.
     * It SHOULD be changed if the ORD information or referenced resource definitions changed.
     * It SHOULD express minor and patch changes that don't lead to incompatible changes.
     *
     * When the `version` major version changes, the [ORD ID](#ord-id) `<majorVersion>` fragment MUST be updated to be identical.
     * In case that a resource definition file also contains a version number (e.g. [OpenAPI `info`.`version`](https://swagger.io/specification/#info-object)), it MUST be equal with the resource `version` to avoid inconsistencies.
     *
     * The general [Version and Lifecycle](../index.md#version-and-lifecycle) flow MUST be followed.
     *
     * Note: A change is only relevant for a version increment, if it affects the ORD resource or ORD taxonomy directly.
     * For example: If a resource within a `Package` changes, but the package itself did not, the package version does not need to be incremented.
     */
    version: string;
    /**
     * Optional, but RECOMMENDED indicator when (date-time) the last change to the resource (including its definitions) happened.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     *
     * In case that this property is available and the value of it hasn't changed since the last crawling, the resource definitions do not need to be fetched and updated.
     *
     * Together with `systemInstanceAware`, this property SHOULD be used to optimize the metadata crawling process of the ORD aggregators.
     */
    lastUpdate?: string;
    /**
     * The visibility/exposure of the described resource.
     * This indicates who is allowed to see (and implicitly also access) the described resource.
     */
    visibility: "public" | "internal" | "private";
    /**
     * The `releaseStatus` specifies the stability of the resource and its external contract.
     */
    releaseStatus: "active" | "beta" | "deprecated";
    /**
     * The sunset date defines when the resource is scheduled to be decommissioned/removed.
     *
     * If the `releaseStatus` is set to `deprecated`, the `sunsetDate` MUST be provided.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     */
    sunsetDate?: string;
    /**
     * The successor resource(s).
     *
     * MUST be a valid reference to an [API Resource](#api-resource) ORD ID.
     *
     * If the `releaseStatus` is set to `deprecated`, `successors` MUST be provided if one exists.
     */
    successors?: string[];
    /**
     * If true, the Integration Dependency is mandatory for the described system to function.
     */
    mandatory: boolean;
    /**
     * List of integration aspects that make up the Integration Dependency.
     *
     * Each aspect listed is a dedicated, constituent part (AND condition).
     */
    aspects?: Aspect[];
    /**
     * If an Integration Dependency conceptually belongs or related to another Integration Dependency, this can be indicated here.
     * One situation would be where two systems each have an Integration Dependency to describe a two-sided integration from each side.
     */
    relatedIntegrationDependencies?: string[];
    /**
     * Generic Links with arbitrary meaning and content.
     */
    links?: Link[];
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
}
/**
 * An (integration) aspect is the constituent part that makes up an Integration Dependency.
 *
 * Each aspect can list references to resources, which could be owned and defined by the integration target or by the described system itself.
 * In case the reference links to own resources, it is implied that they are to be used by the integration target to fulfill the Integration Dependency.
 *
 * If multiple resources are given within an aspect, they are considered alternatives to each other (OR condition).
 * In case an AND condition is needed, multiple aspects need to be added to the Integration Dependency.
 */
export interface Aspect {
    /**
     * Human-readable title.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    title: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description?: string;
    /**
     * If true, the aspect is mandatory to realize the Integration Dependency it contains.
     */
    mandatory: boolean;
    /**
     * If true, the references resources can be provided by multiple system instances.
     * If not, only one integration target is supported.
     */
    supportMultipleProviders?: boolean;
    /**
     * List of API Resource Dependencies.
     */
    apiResources?: APIResourceIntegrationAspect[];
    /**
     * List of Event Resource Dependencies.
     */
    eventResources?: EventResourceIntegrationAspect[];
}
/**
 * API resource related integration aspect
 */
export interface APIResourceIntegrationAspect {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Minimum version of the references resource that the integration requires.
     *
     */
    minVersion?: boolean;
}
/**
 * Event resource related integration aspect
 */
export interface EventResourceIntegrationAspect {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Minimum version of the references resource that the integration requires.
     *
     */
    minVersion?: boolean;
    /**
     * List of individual events or messages that are sufficient to achieve the aspect.
     */
    subset?: EventResourceIntegrationAspectSubset[];
}
/**
 * Defines that Event Resource Integration Aspect only requires a subset of the referenced contract.
 *
 * For events, this could be a list of the events that need to be subscribed in order to make the integration work.
 * This information helps to narrow down what is really necessary and can help optimize the integration, e.g. by only publishing the events that are really needed.
 */
export interface EventResourceIntegrationAspectSubset {
    /**
     * The type ID of the individual event or message.
     *
     * This MUST be an ID that is understood by the used protocol and resource definition format.
     * E.g. for CloudEvents, the [type](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#type) can be used.
     */
    eventType: string;
}
/**
 * The vendor of a product or a package, usually a corporation or a customer / user.
 *
 * The vendor of a `Package` is the owner or creator of the content of the package.
 * The vendor of a `Product` is the owner of the product.
 *
 * If the resources are created by the customer / user of the described system, `customer:vendor:Customer:` MUST be used as vendor.
 *
 * Both have already a [vendor namespace](../index.md#vendor-namespace) within their ORD ID.
 * The `Vendor` entity is giving more details on the vendor namespace.
 * For one vendor namespace there MUST only be exactly one `Vendor` ORD entity describing it.
 *
 * For example: The only correct value for a SAP vendor reference is `sap:vendor:SAP:`.
 */
export interface Vendor {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Human-readable title.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    title: string;
    /**
     * Optional list of partner vendors, referenced through their ORD ID.
     *
     * MUST be a valid reference to a [Vendor](#vendor) ORD ID.
     *
     * This property can be used to indicate partnership relations between vendors.
     */
    partners?: string[];
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
}
/**
 * A **product** in ORD is understood as a software product:
 * A non-versioned, high-level entity for structuring the software portfolio from a software logistics perspective.
 * While **system type** is a technical concept, **product** is the term to use for internal or customer-facing communication.
 *
 * Please note that the ORD concept of a product is very simple on purpose.
 * There are no product versions, product variants, and other more detailed concepts.
 * ORD assumes that this is handled by specialized systems and that ORD only provides the means to correlate to them.
 */
export interface Product {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Correlation IDs can be used to create a reference to related data in other repositories (especially to the system of record).
     *
     * MUST be a valid [Correlation ID](../index.md#correlation-id).
     */
    correlationIds?: string[];
    /**
     * Human readable title of the product
     */
    title: string;
    /**
     * Plain text short description.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    shortDescription: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description?: string;
    /**
     * Vendor / organization that is responsible for the Product.
     *
     * MUST be a valid reference to a [Vendor](#vendor) ORD ID.
     */
    vendor: string;
    /**
     * Optional product parent ORD ID, if a hierarchical product structure needs to be expressed.
     *
     * MUST be a valid reference to a [Product](#product) ORD ID.
     */
    parent?: string;
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
}
/**
 * A **Package** organizes a set of related resources together, by considering all of the following concerns:
 *
 * * The resources are created by the same vendor or customer.
 * * The resources are published together. They share the same development and publishing lifecycle and ownership.
 * * The resources share certain aspects/taxonomy that is inherited down to them (e.g. `vendor`).
 * * If applicable: The resources are meant to be used by only a particular target platform / software.
 *
 * All resources that are not created by the described systems vendor MUST be put into separate packages.
 * This is the case, when:
 *
 * * The resources are created by the customer (user) of the system.
 *   All such resources MUST be assigned to a dedicated Package, where `vendor` is set to `customer:vendor:Customer:`.
 * * The resources are created by partners or third parties.
 *   All such resources MUST be assigned to a dedicated Package for each partner / third party.
 *   The `vendor` MUST be set to a registered, matching Vendor ID (implies also a registered namespace).
 *
 * Another responsibility of a package is human-readable documentation and presentation.
 * It can also express information about the resource providers, terms of use of the APIs,
 * pricing for the usage of the packages, APIs, Events, etc.
 *
 * A package SHOULD contain at least one resource. Avoid empty packages.
 */
export interface Package {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Human-readable title.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    title: string;
    /**
     * Plain text short description.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    shortDescription: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description: string;
    /**
     * The complete [SemVer](https://semver.org/) version string.
     *
     * It MUST follow the [Semantic Versioning 2.0.0](https://semver.org/) standard.
     * It SHOULD be changed if the ORD information or referenced resource definitions changed.
     * It SHOULD express minor and patch changes that don't lead to incompatible changes.
     *
     * When the `version` major version changes, the [ORD ID](#ord-id) `<majorVersion>` fragment MUST be updated to be identical.
     * In case that a resource definition file also contains a version number (e.g. [OpenAPI `info`.`version`](https://swagger.io/specification/#info-object)), it MUST be equal with the resource `version` to avoid inconsistencies.
     *
     * The general [Version and Lifecycle](../index.md#version-and-lifecycle) flow MUST be followed.
     *
     * Note: A change is only relevant for a version increment, if it affects the ORD resource or ORD taxonomy directly.
     * For example: If a resource within a `Package` changes, but the package itself did not, the package version does not need to be incremented.
     */
    version: string;
    /**
     * The [policy level](../../spec-extensions/access-strategies/) (aka. compliance level) that this ORD Document or part of it needs to be compliant with.
     * Depending on the chosen policy level, certain expectations and validations rules will be applied.
     *
     * The policy level can be defined on ORD Document level, but also be overwritten on an individual package or resource level.
     *
     * If not provided, no additional policy level expectations and validations apply.
     *
     */
    policyLevel?: "none" | "sap:core:v1" | "custom";
    /**
     * If the fixed `policyLevel` values need to be extended, an arbitrary `customPolicyLevel` can be provided.
     *
     * The policy level is inherited from packages to resources they contain, but can be overwritten at resource level.
     *
     * MUST only be provided if `policyLevel` is set to `custom`.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     */
    customPolicyLevel?: string;
    /**
     * Links with semantic meaning that are specific to packages.
     */
    packageLinks?: PackageLink[];
    /**
     * Generic links with arbitrary meaning and content.
     *
     * `packageLinks` MUST be preferred if applicable.
     */
    links?: Link[];
    /**
     * Standardized identifier for the license.
     * It MUST conform to the [SPDX License List](https://spdx.org/licenses).
     */
    licenseType?: string;
    /**
     * Optional information that should be provided when creating a support ticket for the resources bundled in this package.
     * This can for example be a "component" name that needs to be chosen in the support portal.
     *
     * Notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     *
     * Please also note that if you want to provide link(s) where you can find support information,
     * you can use `packageLinks` with a link of type `support`.
     */
    supportInfo?: string;
    /**
     * Vendor / organization that is the creator (or responsible party) of the resources that are part of the `Package`.
     *
     * MUST be a valid reference to a [Vendor](#vendor) ORD ID.
     *
     * MUST be set to `customer:vendor:Customer:` if the contents of the package are created by the customer / user.
     *
     * MUST be set to a registered partner vendor, if the contents of the package are created by a partner / third party.
     */
    vendor: string;
    /**
     * List of products this resource is a part of.
     *
     * MUST be a valid reference to a [Product](#product) ORD ID.
     *
     * `partOfProducts` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     *
     * @minItems 0
     */
    partOfProducts?: string[];
    /**
     * List of countries that the package resources are applicable to.
     *
     * MUST be expressed as an array of country codes according to [IES ISO-3166 ALPHA-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
     *
     * `countries` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    countries?: string[];
    /**
     * List of line of business tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * `lineOfBusiness` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    lineOfBusiness?: ((string | "Asset Management" | "Commerce" | "Finance" | "Human Resources" | "Manufacturing" | "Marketing" | "R&D Engineering" | "Sales" | "Service" | "Sourcing and Procurement" | "Supply Chain" | "Sustainability" | "Metering" | "Grid Operations and Maintenance" | "Plant Operations and Maintenance" | "Maintenance and Engineering") & string)[];
    /**
     * List of industry tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * `industry` that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    industry?: ((string | "Aerospace and Defense" | "Automotive" | "Banking" | "Chemicals" | "Consumer Products" | "Defense and Security" | "Engineering Construction and Operations" | "Healthcare" | "Higher Education and Research" | "High Tech" | "Industrial Machinery and Components" | "Insurance" | "Life Sciences" | "Media" | "Mill Products" | "Mining" | "Oil and Gas" | "Professional Services" | "Public Sector" | "Retail" | "Sports and Entertainment" | "Telecommunications" | "Travel and Transportation" | "Utilities" | "Wholesale Distribution") & string)[];
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
}
/**
 * Links with specific semantic meaning that are related to `Package`.
 *
 * If a generic `Link` can also be expressed via `PackageLink`, the latter MUST be chosen.
 */
export interface PackageLink {
    /**
     * Package link type
     */
    type: "terms-of-service" | "license" | "client-registration" | "payment" | "sandbox" | "service-level-agreement" | "support" | "custom";
    /**
     * If the fixed `type` enum values need to be extended, an arbitrary `customType` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customType?: string;
    /**
     * [URL](https://tools.ietf.org/html/rfc3986) to the PackageLink. For more information, see `type`.
     */
    url: string;
    [k: string]: any | undefined;
}
/**
 * A **Consumption Bundle** organizes a set of related resources into a single group for consumption purposes.
 *
 * The main use case is to enable developers to easily discover and access APIs and Events from the system instances they are extending.
 *
 * The consumption bundle expresses information about how the APIs and Events that it contains can be accessed.
 * This potentially also includes instructions and details how to request access and credentials for resources.
 *
 * All resources that are part of the same consumption bundle MUST be accessible through the same set of credentials.
 * Such credentials can be programmatically obtained via one of the provided `credentialExchangeStrategies`.
 *
 * A consumption bundle SHOULD have at least one association with a resource (0..n). Avoid empty consumption bundles.
 * A consumption bundle MUST NOT contain APIs and Events that are NOT defined in the ORD document(s) returned
 * by the system instance that defines the consumption bundle.
 *
 * Please note that some ORD consumer use cases MAY depend on consumption bundle assignments to work with the resources.
 */
export interface ConsumptionBundle {
    /**
     * The ORD ID is a stable, globally unique ID for ORD resources or taxonomy.
     *
     * It MUST be a valid [ORD ID](../index.md#ord-id) of the appropriate ORD type.
     */
    ordId: string;
    /**
     * Local ID, as known by the described system.
     */
    localId?: string;
    /**
     * Correlation IDs can be used to create a reference to related data in other repositories (especially to the system of record).
     *
     * MUST be a valid [Correlation ID](../index.md#correlation-id).
     */
    correlationIds?: string[];
    /**
     * Human-readable title.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    title: string;
    /**
     * Plain text short description.
     *
     * MUST NOT exceed 255 chars.
     * MUST NOT contain line breaks.
     */
    shortDescription?: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     */
    description?: string;
    /**
     * The complete [SemVer](https://semver.org/) version string.
     *
     * It MUST follow the [Semantic Versioning 2.0.0](https://semver.org/) standard.
     * It SHOULD be changed if the ORD information or referenced resource definitions changed.
     * It SHOULD express minor and patch changes that don't lead to incompatible changes.
     *
     * When the `version` major version changes, the [ORD ID](#ord-id) `<majorVersion>` fragment MUST be updated to be identical.
     * In case that a resource definition file also contains a version number (e.g. [OpenAPI `info`.`version`](https://swagger.io/specification/#info-object)), it MUST be equal with the resource `version` to avoid inconsistencies.
     *
     * The general [Version and Lifecycle](../index.md#version-and-lifecycle) flow MUST be followed.
     *
     * Note: A change is only relevant for a version increment, if it affects the ORD resource or ORD taxonomy directly.
     * For example: If a resource within a `Package` changes, but the package itself did not, the package version does not need to be incremented.
     */
    version?: string;
    /**
     * Optional, but RECOMMENDED indicator when (date-time) the last change to the resource (including its definitions) happened.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     *
     * In case that this property is available and the value of it hasn't changed since the last crawling, the resource definitions do not need to be fetched and updated.
     *
     * Together with `systemInstanceAware`, this property SHOULD be used to optimize the metadata crawling process of the ORD aggregators.
     */
    lastUpdate?: string;
    /**
     * Defines the supported strategies for how the consumption credentials can be exchanged.
     *
     * Ideally, the system type supports a strategy that can automate the exchange.
     */
    credentialExchangeStrategies?: CredentialExchangeStrategy[];
    /**
     * Generic links with arbitrary meaning and content.
     */
    links?: Link[];
    /**
     * List of free text style tags.
     * No special characters are allowed except `-`, `_`, `.`, `/` and ` `.
     *
     * Tags that are assigned to a `Package` are inherited to all of the ORD resources it contains.
     */
    tags?: string[];
    labels?: Labels;
    documentationLabels?: DocumentationLabels;
}
/**
 * The credential exchange strategy specifies how a set of credentials for a particular usage
 * of the APIs in the consumption bundle can be obtained.
 * Until a SAP-wide strategy for obtaining such credentials exists and is agreed upon,
 * both LoBs and aggregators (namely Unified Customer Landscape) can define their own strategy specifications.
 *
 * While the actual flow in term of API calls can differ between the different strategies,
 * the end goal would always be the possibility for automatically obtaining credentials for each client
 * that would like to use the APIs from a particular bundle.
 */
export interface CredentialExchangeStrategy {
    /**
     * The type of credential exchange strategy.
     */
    type: "custom";
    /**
     * If the fixed `type` enum values need to be extended, an arbitrary `customType` can be provided.
     *
     * MUST be a valid [Specification ID](../index.md#specification-id).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customType?: string;
    /**
     * Human-readable description about how the credential exchange is achieved, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     *
     * MUST only be provided if `type` is set to `custom`.
     */
    customDescription?: string;
    /**
     * [URL reference](https://tools.ietf.org/html/rfc3986#section-4.1) (URL or relative reference) to the credential exchange callback endpoint.
     *
     * This allows requesting a set of credentials that can be used for consuming all the APIs and Events that are part of the bundle.
     *
     * The interface contract/protocol is dependent and defined by the chosen `type`.
     *
     * Whenever a client wants to consume a resource within a particular bundle, this endpoint can be called to obtain the credentials that this client can use.
     *
     * The returned credentials MUST be valid for all resources that are part of the respective bundle.
     * The endpoint SHOULD return a different set of credentials on each invocation.
     */
    callbackUrl?: string;
}
/**
 * A tombstone indicates that a previously published ORD resource or taxonomy has been removed / decommissioned.
 * This MUST be indicated explicitly, so ORD aggregators and consumers can learn about the removal.
 *
 * It MUST be kept sufficiently long so that all ORD aggregators can learn about the tombstone.
 * After that it MAY be removed.
 */
export interface Tombstone {
    /**
     * [ORD ID](../index.md#ord-id) of the ORD resource/taxonomy that has been removed.
     */
    ordId: string;
    /**
     * The date when the ORD resource/taxonomy was removed.
     * This is related to the `sunsetDate` that can be set to announce a resource as deprecated *before* the removal and setting of a tombstone.
     *
     * The date format MUST comply with [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6).
     */
    removalDate: string;
    /**
     * Full description, notated in [CommonMark](https://spec.commonmark.org/) (Markdown).
     *
     * The description of a Tombstone MAY be added to the changelog of the removed resource by an ORD aggregator.
     */
    description?: string;
    [k: string]: any | undefined;
}
