import { CONST } from "@/constants"

const getMessage = (message: any, isError = true) => {
    if (typeof message === 'string') {
        return message
    }

    return message?.message ?? (isError ? CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG : '')
}

const error = {
    getMessage
}

export { error }
