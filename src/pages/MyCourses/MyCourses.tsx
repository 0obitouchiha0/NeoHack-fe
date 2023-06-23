import axios from 'axios';
import React from 'react';
import { Navigate } from 'react-router';
import CourseCard from '../../components/CourseCard/CourseCard';
import Layout from '../../components/Layout/Layout';
import { useAppSelector } from '../../store/store';
import { ICourse } from '../Courses/Courses';
import styles from './styles.module.scss';

const MyCourses = () => {
    const {user} = useAppSelector(state => state.user);
    if(user === null) return <Navigate to="/auth"/>;

    const [courses, setCourses] = React.useState<ICourse[]>([]);

    React.useEffect(() => {
        axios.get(`lk/info/${user.id}`)
            .then(res => res.data)
            .then((res) => {
                setCourses(res.courses);
            });
    }, []);

    return (
        <Layout>
            <div className={styles.mycourses}>
                <h1 className={styles.mycourses__title}>Мои курсы</h1>
                <ul className={styles.mycourses_list}>
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course}/>
                    ))}
                </ul>
            </div>
        </Layout>
    );
};

export default MyCourses;