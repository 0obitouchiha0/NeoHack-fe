import React from 'react';
import { useNavigate } from 'react-router';

import styles from './styles.module.scss';
import { ICourse } from '../../pages/Courses/Courses';

interface CourseCardProps {
    course: ICourse
}

const CourseCard = ({course}: CourseCardProps) => {

    const navigate = useNavigate();

    return (
        <li className={styles.course_card}>
            <h3 className={styles.course_card__title} onClick={() => navigate(`/courses/${course.id}`)}>{course.title}</h3>
            <img className={styles.course_card__img} src={course.img} alt="Картинка курса" />
            <p className={styles.course_card__description}>{course.description}</p>
            <span className={styles.course_card__tag}>#{course.tag}</span>
        </li>
    );
};

export default CourseCard;
