import React from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useAppSelector } from '../../store/store';

import Layout from '../../components/Layout/Layout';
import styles from './styles.module.scss';
import { LeftOutlined } from '@ant-design/icons';
import { ICourse } from '../Courses/Courses';

interface IAnswer {
    id: number,
    title: string,
    weight: number
}

interface IQuestion {
    id: number,
    questionType: 'ONE' | 'MANY',
    title: string,
    answers: IAnswer[]
}

export interface ITest {
    id: number,
    title: string,
    minScore: number,
    maxScore: number,
    questions: IQuestion[]
}

export interface IScore {
    id: number,
    testId: number,
    testTitle: string,
    result: 1.5
}

const Test = () => {
    const {user} = useAppSelector(state => state.user);
    if(user === null) return <Navigate to="/auth"/>;

    const {courseId, testId} = useParams();
    const navigate = useNavigate();
    
    const [test, setTest] = React.useState<ITest>({} as ITest);
    const [answers, setAnswers] = React.useState<Record<number, IAnswer[]>>([]);
    const [hasCourse, setHasCourse] = React.useState(true);
    const [alreadyPassed, setAlreadyPassed] = React.useState(false);
    const [score, setScore] = React.useState();

    if(!hasCourse) handleGoToCourse();

    React.useEffect(() => {
        axios.get(`lk/info/${user.id}`)
            .then(res => res.data)
            .then((res) => {
                const resHasCourse = !!res.courses.find((course: ICourse) => course.id === Number(courseId));
                setHasCourse(resHasCourse);
                const thisTestScore = res.scores.find((score: IScore) => score.testId === Number(testId))?.result;
                setAlreadyPassed(!!thisTestScore);
                setScore(thisTestScore);
                if(resHasCourse) {
                    axios.get(`test/${testId}`)
                        .then(res => res.data)
                        .then((res: ITest) => {
                            setTest(res);
                        });
                }
            });
    }, []);

    function handleGoToCourse() {
        navigate(`/courses/${courseId}`);
    }

    function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>, question: IQuestion, answer: IAnswer) {
        if(e.target.checked) setAnswers(prev => ({...prev, [question?.id]: prev[question?.id] ? [...prev[question?.id], answer] : [answer]}));
        else setAnswers(prev => ({...prev, [question?.id]: prev[question?.id] ? prev[question?.id].filter(filterAnswer => filterAnswer?.id !== answer?.id) : []}));
    }

    function handleSendAnswers() {
        const answersArray = Object.values(answers).reduce((a, v) => [...a, ...v], []);
        const reqObject = {
            userId: user?.id,
            testTitle: test.title,
            testId,
            answers: answersArray
        };
        axios.post('/test/result', reqObject)
            .then(res => res.data)
            .then(res => {
                setScore(res);
                setAlreadyPassed(true);
            });
    }

    return (
        <Layout>
            <div className={styles.test}>
                <h3 className={styles.test__back} onClick={handleGoToCourse}><LeftOutlined /> Вернуться к курсу</h3>
                <h1 className={styles.test__name}>Тест &quot;{test.title}&quot;</h1>
                <h4 className={styles.test__min}>Минимальный проходной балл: {test.minScore}</h4>
                <h4 className={styles.test__max}>Максимальный балл: {test.maxScore}</h4>
                <ul className={styles.test_questions}>
                    {test.questions?.map(question => (
                        <li key={question.id} className={styles.test_questions__item}>
                            <h6>{question.title}</h6>
                            {question.questionType === 'ONE'
                                ? question.answers?.map(answer => (
                                    <div key={answer?.id}>
                                        <input 
                                            type="radio" 
                                            id="answer" 
                                            name={String(answer?.id)} 
                                            value={answer?.id} 
                                            checked={!!answers[question?.id] && !!answers[question?.id].length && answers[question?.id][0]?.id === answer?.id} 
                                            onChange={() => setAnswers(prev => ({...prev, [question?.id]: [answer]}))}
                                            disabled={alreadyPassed}
                                        />
                                        <label htmlFor="answer">{answer?.title}</label>
                                    </div>
                                ))
                                : question.answers?.map(answer => (
                                    <div key={answer?.id}>
                                        <input 
                                            type="checkbox" 
                                            id="answer" 
                                            name={String(answer?.id)} 
                                            value={answer?.id} 
                                            checked={!!answers[question?.id] && !!answers[question?.id].length && !!answers[question?.id].find(findAnswer => findAnswer?.id === answer?.id)} 
                                            onChange={(e) => handleCheckboxChange(e, question, answer)}
                                            disabled={alreadyPassed}
                                        />
                                        <label htmlFor="answer">{answer?.title}</label>
                                    </div>
                                ))}
                        </li>
                    ))}
                </ul>
                <button className={styles.test__submit} onClick={handleSendAnswers} disabled={alreadyPassed}>Отправить ответы</button>
                {score !== undefined && <span className={styles.test__message}>Ваш балл: {score}</span>} 

            </div>
        </Layout>
    );
};

export default Test;
