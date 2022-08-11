import { FocusEvent } from "react"

import { Textarea } from "@chakra-ui/react"

import { iParagraphAnswer } from "../../../../../models/Answer"
import { iParagraphQuestion } from "../../../../../models/Question"
import { AnswerProps } from "../QuestionAnswer"

const ParagraphAnswer = ({ answer }: AnswerProps<iParagraphQuestion, iParagraphAnswer>) => {
	return (
		<Textarea
			defaultValue={answer?.paragraph}
			placeholder="Paragraph answer"
			borderColor="whiteAlpha.300"
			onFocus={(e: FocusEvent<HTMLTextAreaElement>) => e.target.blur()}
			cursor="not-allowed"
		/>
	)
}

export default ParagraphAnswer
