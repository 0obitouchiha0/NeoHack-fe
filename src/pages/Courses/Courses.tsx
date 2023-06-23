import React from 'react';
import axios from 'axios';
import { Navigate } from 'react-router';
import { useAppSelector } from '../../store/store';

import Layout from '../../components/Layout/Layout';
import styles from './styles.module.scss';
import clsx from 'clsx';
import CourseCard from '../../components/CourseCard/CourseCard';
import { ITest } from '../Test/Test';

export interface ICourse {
    id: number,
    tag: string,
    title: string,
    description: string,
    img: string,
    test: null | ITest
}

const Courses = () => {
    const {user} = useAppSelector(state => state.user);
    if(user === null) return <Navigate to="/auth"/>;

    const [courses, setCourses] = React.useState<ICourse[]>([]);
    const [filteredCourses, setFilteredCourses] = React.useState<ICourse[]>(courses);
    const [tags, setTags] = React.useState<string[]>([]);
    const [activeTag, setActiveTag] = React.useState('');
    const [searchValue, setSearchValue] = React.useState('');

    React.useEffect(() => {
        axios.get('courses')
            .then(res => res.data)
            .then((res: ICourse[]) => {
                setCourses(res);
                setFilteredCourses(res);
                const tagsArr = Array.from(new Set(res.reduce((a, v) => [...a, v.tag], [] as string[])));
                setTags(tagsArr);
            });
    }, []);

    function filterByTag(tag: string) {
        if(tag === '') {
            setFilteredCourses(courses);
            setActiveTag('');
        } else {
            const coursesWithRequiredTag = courses.filter(course => course.tag === tag);
            setFilteredCourses(coursesWithRequiredTag);
            setActiveTag(tag);
        }
    }

    function filterByTitle() {
        if(searchValue === '') {
            setFilteredCourses(courses);
        } else {
            const coursesWithRequiredTag = courses.filter(course => course.title.includes(searchValue));
            setFilteredCourses(coursesWithRequiredTag);
        }
        setSearchValue('');
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.courses}>
                    <div className={styles.courses__search}>
                        <h1>Курсы</h1>
                        <input type="text" placeholder="Найти по названию" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/> 
                        <button onClick={filterByTitle}>Найти</button>
                    </div>
                    <ul className={styles.courses_list}>
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </ul>
                </div>
                <div className={styles.filter_menu}>
                    <h3 className={styles.filter_menu__title}>Поиск по тегу:</h3>
                    <ul className={styles.tags}>
                        <li className={clsx(styles.tags, styles.tags__item, activeTag === '' && styles['tags__item--active'])} onClick={() => filterByTag('')}>Все курсы</li>
                        {tags.map(tag => (
                            <li className={clsx(styles.tags, styles.tags__item, tag === activeTag && styles['tags__item--active'])} key={tag} onClick={() => filterByTag(tag)}>#{tag}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default Courses;
