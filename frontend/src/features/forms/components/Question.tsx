import { createRef, PropsWithChildren, useContext, useEffect } from "react"
import { Draggable } from "react-beautiful-dnd"
import { useImmer } from "use-immer"

import { DragHandleIcon } from "@chakra-ui/icons"
import { Box, Button, IconButton, Image, Input, useDisclosure, usePrevious } from "@chakra-ui/react"

import Card from "../../../components/Card"
import AuthContext from "../../../contexts/AuthContext"
import FormContext from "../../../contexts/FormContext"
import useFetcher from "../../../hooks/useFetcher"
import {
	iChoiceQuestion, iColorQuestion, iDateTimeQuestion, iParagraphQuestion, iQuestion,
	iSliderQuestion, iSwitchQuestion, iTableQuestion, iTextQuestion
} from "../../../models/Question"
import getQuestionDifference from "../../../utils/getQuestionDifference"
import EditableText from "./EditableText"
import NewQuestionButton from "./NewQuestionButton"
import OptionsMenu from "./OptionsMenu"
import QuestionDeleteAlert from "./QuestionDeleteAlert"
import ChoiceQuestion from "./questions/ChoiceQuestion"
import ColorQuestion from "./questions/ColorQuestion"
import DateTimeQuestion from "./questions/DateTimeQuestion"
import ParagraphQuestion from "./questions/ParagraphQuestion"
import SliderQuestion from "./questions/SliderQuestion"
import SwitchQuestion from "./questions/SwitchQuestion"
import TableQuestion from "./questions/TableQuestion"
import TextQuestion from "./questions/TextQuestion"

export type QuestionProps<iQ extends iQuestion> = PropsWithChildren<{
	editable: boolean
	question: iQ
	setQuestion: (question: iQ) => void
}>

const Question = (
	props: PropsWithChildren<{
		index: number
		editable: boolean
		parentQuestion: iQuestion
	}>
) => {
	const { index, editable, parentQuestion } = props

	const { token } = useContext(AuthContext)
	const { setQuestions } = useContext(FormContext)
	const fetcher = useFetcher()
	const menuRef = createRef<HTMLButtonElement>()

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [question, setQuestion] = useImmer(parentQuestion)
	const __question = usePrevious(question)

	useEffect(() => {
		if (!token || !__question) return

		const difference = getQuestionDifference(__question, question)
		if (Object.keys(difference).length > 0) {
			fetcher(
				{
					url: "/forms/{form_id}/questions/{question_id}",
					method: "PUT",
					parameters: {
						form_id: question.form_id,
						question_id: question.id
					},
					body: difference,
					token
				},
				{
					toast: false
				}
			).then(({ data }) => {
				if (data) {
					setQuestions(questions =>
						questions.map((q, i) => (i === index ? data.question : q))
					)
				}
			})
		}
	}, [question, token])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) {
			setQuestion(question => {
				question.photo = null
			})
			return
		}

		if (!file.type.startsWith("image/")) {
			e.target.value = ""
			return
		}

		const reader = new FileReader()
		reader.onload = () => {
			setQuestion(question => {
				question.photo = reader.result as string
			})
		}
		reader.readAsDataURL(file)
	}

	const componentProps = {
		editable,
		question,
		setQuestion
	}

	return (
		<>
			<Draggable
				index={index}
				draggableId={parentQuestion.id}>
				{provided => (
					<Box
						ref={editable ? provided.innerRef : null}
						{...(editable ? provided.draggableProps : {})}>
						<Card
							mb={4}
							pos="relative">
							<IconButton
								hidden={!editable}
								icon={<DragHandleIcon />}
								aria-label="Options"
								pos="absolute"
								right={4}
								minW={6}
								onClick={() => menuRef.current?.click()}
								{...(editable ? provided.dragHandleProps : {})}
							/>

							<OptionsMenu
								editable={editable}
								index={index}
								menuRef={menuRef}
								onDelete={onOpen}
								question={question}
								setQuestion={setQuestion}
							/>

							<Box mr={editable ? 8 : 0}>
								<EditableText
									editable={editable}
									required={true}
									text={question.title}
									setText={title => setQuestion({ ...question, title })}
									placeholder="Add a title"
									fontSize="2xl"
									noOfLines={2}
								/>
							</Box>
							<EditableText
								editable={editable}
								text={question.description ?? ""}
								setText={description => setQuestion({ ...question, description })}
								placeholder="Add a description"
								fontSize="lg"
								mt={2}
								noOfLines={2}
							/>

							{question.photo ? (
								<>
								<Button mt={2}>Remove Image</Button>
									<Image
										src={question.photo}
										mt={2}
										maxH={56}
									/>
								</>
							) : (
								<Input
									type="file"
									px={1}
									py={1}
									mt={2}
									accept="image/*"
									placeholder="Basic usage"
									onChange={handleFileChange}
								/>
							)}
							<Box h={4} />

							{question.type === "text" ? (
								<TextQuestion
									{...(componentProps as QuestionProps<iTextQuestion>)}
								/>
							) : null}

							{question.type === "paragraph" ? (
								<ParagraphQuestion
									{...(componentProps as QuestionProps<iParagraphQuestion>)}
								/>
							) : null}

							{question.type === "color" ? (
								<ColorQuestion
									{...(componentProps as QuestionProps<iColorQuestion>)}
								/>
							) : null}

							{question.type === "choice" ? (
								<ChoiceQuestion
									{...(componentProps as QuestionProps<iChoiceQuestion>)}
								/>
							) : null}

							{question.type === "switch" ? (
								<SwitchQuestion
									{...(componentProps as QuestionProps<iSwitchQuestion>)}
								/>
							) : null}

							{question.type === "slider" ? (
								<SliderQuestion
									{...(componentProps as QuestionProps<iSliderQuestion>)}
								/>
							) : null}

							{question.type === "datetime" ? (
								<DateTimeQuestion
									{...(componentProps as QuestionProps<iDateTimeQuestion>)}
								/>
							) : null}

							{question.type === "table" ? (
								<TableQuestion
									{...(componentProps as QuestionProps<iTableQuestion>)}
								/>
							) : null}
						</Card>

						<NewQuestionButton
							editable={editable}
							index={index + 1}
						/>
					</Box>
				)}
			</Draggable>

			<QuestionDeleteAlert
				isOpen={isOpen}
				onCancel={onClose}
				index={index}
				question={question}
				parentQuestion={parentQuestion}
			/>
		</>
	)
}

export default Question
