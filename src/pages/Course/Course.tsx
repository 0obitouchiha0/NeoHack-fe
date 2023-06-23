import React from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../store/store';
import Layout from '../../components/Layout/Layout';
import styles from './styles.module.scss';
import { ICourse } from '../Courses/Courses';
import { ILesson } from '../Lesson/Lesson';

const Course = () => {
    const {user} = useAppSelector(state => state.user);
    if(user === null) return <Navigate to="/auth"/>;

    const [course, setCourse] = React.useState<ICourse>();
    const [lessons, setLessons] = React.useState<ILesson[]>([]);
    const [testId, setTestId] = React.useState<number>();
    const [hasCourse, setHasCourse] = React.useState(false);

    const {courseId} = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        axios.get(`courses/${courseId}`)
            .then(res => res.data)
            .then(res => {
                setCourse(res);
                setLessons(res.lessons);
                setTestId(res.test?.id);
                axios.get(`/lk/info/${user.id}`)
                    .then(res => res.data)
                    .then(res => {
                        const isCourseAdded = !!res.courses.find((course: ICourse) => course.id === Number(courseId));
                        setHasCourse(isCourseAdded);
                    });
            });
    }, []);

    function handleSubscribe() {
        if(!hasCourse) {
            axios.put('/user/subscribe', {userId: user?.id, courseId: Number(courseId)})
                .then(() => {
                    setHasCourse(true);
                });
        }
    }

    function handleLessonClick(lessonId: number) {
        if(hasCourse) navigate(`/courses/${courseId}/lesson/${lessonId}`);
    }

    return (
        <Layout>
            <div className={styles.course}>
                <div className={styles.course_info}>
                    <div className={styles.course_info__header}>
                        <h1>{course?.title}</h1>
                        <button disabled={hasCourse} onClick={handleSubscribe}>{hasCourse ? 'Добавлен' : 'Добавить'}</button>
                    </div>
                    <img src={course?.img} alt="Картинка курса" className={styles.course_info__img}/>
                    <p className={styles.course_info__description}><b>Описание курса: </b>{course?.description}</p>
                </div>
                <div className={styles.lessons}>
                    <h3 className={styles.lessons__title}>Доступные уроки</h3>
                    <ul className={styles.lessons_list}>
                        {lessons.map(lesson => (
                            <li 
                                key={lesson.id} 
                                className={clsx(styles.lessons_list__item, hasCourse && styles['lessons_list__item--link'])}
                                onClick={() => handleLessonClick(lesson.id)}
                            >{lesson.name}</li>
                        ))}
                    </ul>
                    {hasCourse && course?.test && <Link className={styles.lessons__test} to={`/courses/${courseId}/test/${testId}`}>Пройти тестирование по курсу</Link>}
                </div>
            </div>
        </Layout>
    );
};

export default Course;
