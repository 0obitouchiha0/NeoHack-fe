import React from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useAppSelector } from '../../store/store';

import Layout from '../../components/Layout/Layout';
import styles from './styles.module.scss';
import { LeftOutlined } from '@ant-design/icons';

export interface ILesson {
    id: number,
    name: string,
    material: {
        id: number,
        textMaterial: string,
        linkMaterial: string
    }
}

const Lesson = () => {
    const {user} = useAppSelector(state => state.user);
    if(user === null) return <Navigate to="/auth"/>;

    const {courseId, lessonId} = useParams();
    const navigate = useNavigate();
    
    const [lesson, setLesson] = React.useState<ILesson>({} as ILesson);

    React.useEffect(() => {
        axios.get(`lesson/${lessonId}`)
            .then(res => res.data)
            .then((res: ILesson) => {
                setLesson(res);
            });
    }, []);

    function handleGoToCourse() {
        navigate(`/courses/${courseId}`);
    }

    return (
        <Layout>
            <div className={styles.lesson}>
                <h3 className={styles.lesson__back} onClick={handleGoToCourse}><LeftOutlined /> Вернуться к курсу</h3>
                <h1 className={styles.lesson__name}>{lesson.name}</h1>
                <p className={styles.lesson__text}>
                    <b>Текстовый материал урока:</b> {lesson.material?.textMaterial}
                </p>
                <a className={styles.lesson__link} href={lesson.material?.linkMaterial} target="_blank" rel="noreferrer">Ссылка на дополнительные материалы</a>
            </div>
        </Layout>
    );
};

export default Lesson;
