/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_chat } from '../models/Body_chat';
import type { FeedbackType } from '../models/FeedbackType';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ChatService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Chat
     * @param botId
     * @param conversationId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public chat(
        botId: string,
        conversationId: (string | null),
        requestBody: Body_chat,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/bots/{bot_id}/chat/{conversation_id}',
            path: {
                'bot_id': botId,
                'conversation_id': conversationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Chat Feedback
     * @param botId
     * @param chatId
     * @param feedback
     * @returns any Successful Response
     * @throws ApiError
     */
    public updateChatFeedback(
        botId: string,
        chatId: string,
        feedback: FeedbackType,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/bots/{bot_id}/chat/{chat_id}/feedback',
            path: {
                'bot_id': botId,
                'chat_id': chatId,
            },
            query: {
                'feedback': feedback,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
