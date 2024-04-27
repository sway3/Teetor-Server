import OpenAI from 'openai';
import { Request, Response } from 'express';
import MentoringSession from '../models/mentoringSessionModel';

require('dotenv').config();

const getMentoringSessionInfo = async (mentoringSessionId: string) => {
  const mentoringSession = await MentoringSession.findById(mentoringSessionId);

  const mentorCanHelpWith = mentoringSession?.mentorInfo.canHelpWith.join(', ');
  const mentorDescription = mentoringSession?.mentorInfo.description;
  const menteeNeedHelpWith =
    mentoringSession?.menteeInfo.needHelpWith.join(', ');
  const menteeDescription = mentoringSession?.menteeInfo.description;

  return {
    mentorCanHelpWith,
    mentorDescription,
    menteeNeedHelpWith,
    menteeDescription,
  };
};

export const chatSuggestController = async (
  mentorInfo: any,
  menteeInfo: any
) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });

    const menteeNeedHelpWith = menteeInfo.needHelpWith;
    const menteeDescription = menteeInfo.description;
    const mentorCanHelpWith = mentorInfo.canHelpWith;
    const mentorDescription = mentorInfo.description;

    const suggestion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an assistant to help mentors and mentees to start off a conversation in my web application.`,
        },
        {
          role: 'user',
          content: `A mentor and mentee just started a session and they are about to message each other. \
            In this session, the mentee needs help with ${menteeNeedHelpWith}. \
            The specific description about what the mentee expect from the mentor is \
            the following: ${menteeDescription}. The mentor can help with ${mentorCanHelpWith} \
            and the specific description is: ${mentorDescription}. Suggest four different messages or questions that \
            the mentor can start off the conversation to assist the skills that the mentee needs help with, \
            as the mentor might not have any mentoring experience. Also, do the same thing for the \
            mentee, but in this case try to create questions that the mentee can ask mentor about\
            the struggle that was provided in the specific description. Provide these suggestions as\
            a JSON format that looks like {mentor:[(list of suggestions)], mentee:[(list of suggestions)]}.\
            Do not include any other text in your response, apart from the JSON.`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const result: any = suggestion.choices[0].message.content;
    return JSON.parse(result);
  } catch (error) {
    console.log(error);
  }
};
