import React from 'react';
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';

import Auth from './pages/Auth/Auth';
import Course from './pages/Course/Course';
import Courses from './pages/Courses/Courses';
import Lesson from './pages/Lesson/Lesson';
import MyCourses from './pages/MyCourses/MyCourses';
import Profile from './pages/Profile/Profile';
import Test from './pages/Test/Test';

const router = createBrowserRouter([
    {
        path: '/courses',
        element: <Courses/>,
    },
    {
        path: '/mycourses',
        element: <MyCourses/>,
    },
    {
        path: '/profile',
        element: <Profile/>,
    },
    {
        path: '/auth',
        element: <Auth/>,
    },
    {
        path: '/courses/:courseId',
        element: <Course/>,
    },
    {
        path: '/courses/:courseId/lesson/:lessonId',
        element: <Lesson/>,
    },
    {
        path: '/courses/:courseId/test/:testId',
        element: <Test/>,
    },
    {
        path: '*',
        element: <Navigate to="/courses"/>,
    }
]);

const App = () => {
    return (
        <RouterProvider router={router}/>
    );
};

export default App;
