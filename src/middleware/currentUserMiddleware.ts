import {Action} from "routing-controllers"

export async function currentUserMiddleware (action: Action) {
    return action.request.user
}