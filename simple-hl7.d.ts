// types/simple-hl7.d.ts
declare module 'simple-hl7' {
    // Represents an HL7 message
    export interface HL7Message {
        segments: HL7Segment[]
        header: {
            name: string
            delimiters: HL7Segment[]
            fields: HL7Segment[]
        }
        // Add other properties as needed
    }

    // Represents an HL7 segment
    export interface HL7Segment {
        name: string
        fields: HL7Field[]
        // Add other properties as needed
    }

    // Represents an HL7 field
    export interface HL7Field {
        value: string
        components: HL7Component[]
        // Add other properties as needed
    }

    // Represents an HL7 component
    export interface HL7Component {
        value: string
        // Add other properties as needed
    }

    // Represents an HL7 parser
    export class Parser {
        parse(message: string): HL7Message
    }

    export class Message {
        constructor(
            ...fields: string[] // Adjust according to actual constructor parameters
        )

        addSegment(name: string, ...fields: any): void

        getSegment(name: string): HL7Segment | undefined

        getSegments(name: string): HL7Segment | undefined

        log(): string
    }

    // Parses an HL7 message and returns an HL7Message object
    export function parse(message: string): HL7Message
}
