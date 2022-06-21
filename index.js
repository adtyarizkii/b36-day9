const express = require('express');
const moment = require('moment');
const db = require('./connection/db')

const app = express();
const PORT = 80;

const isLogin = true;
const projects = [];


app.set('view engine', 'hbs');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));


app.listen(PORT, () => {
    console.log('Server running on PORT:', PORT);
});

db.connect((err, _, done) => {
    if (err) throw err;


    console.log('Database Connection Success!');
    done();
});

// ========================= END PREPARATION ==========================================

app.get('/', (req, res) => {
    db.connect((err, client, done) => {
        if (err) throw err;
    
        const query = 'SELECT * FROM tb_projects';

        client.query(query, (err, result) => {
            if (err) throw err;

            const projectsData = result.rows;

            function getProjectDuration(endDate, startDate){
                const end = new Date(endDate);
                const start = new Date(startDate);
            
                let duration = ``;
            
                if (start < end) {
                  duration = new Date(end - start);
                }
        
                let years = (duration.getFullYear() - 1970);
                let months = duration.getMonth();
                let days = duration.getDate();
            
                let yearTxt = "year";
                let monthTxt = "month";
                let dayTxt = "day";
            
                if (years > 1) yearTxt += "s";
                if (months > 1) monthTxt += "s";
                if (days > 1) dayTxt += "s";
            
                if (years >= 1) {
                    duration = `${years} ${yearTxt} ${months} ${monthTxt} ${days} ${dayTxt}`;
                } else if (months >= 1) {
                    duration = `${months} ${monthTxt} ${days} ${dayTxt}`;
                } else {
                    duration = `${days} ${dayTxt}`;
                } 
                    return duration;
            }
            function durationDate(startDate, endDate){
                const start = new Date(startDate);
                const end = new Date(endDate);

                const durationDate = `${moment(start).format('DD MMM YYYY')} - ${moment(end).format('DD MMM YYYY')}`;
                return durationDate;
            }

            const newProject = projectsData.map((project) => {
                return {
                ...project,
                distanceDate: getProjectDuration(project.end_date, project.start_date),
                durationDate: durationDate(project.start_date, project.end_date),
                isLogin,
                }
            });
            console.log(newProject);

            res.render('index', { isLogin, projects, project: newProject });
        });
        console.log(projects);
        done();
    });

    // const newProject = projects.map((project) => {
    //     project.isLogin = isLogin;
    //     return {
    //         ...project
    //     }
    // });
});

app.get('/contact', (req, res) => {
    res.render('contact-me', { isLogin });
});


app.get('/add-project', (req, res) => {
    res.render('project', { isLogin });
});

app.post('/add-project', (req, res) => {

    const projectName = req.body.projectName;
    const projectDate = {
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }

    function getProjectDuration(){
        const end = new Date(projectDate.endDate);
        const start = new Date(projectDate.startDate);
    
        let duration = ``;
    
        if (start < end) {
          duration = new Date(end - start);
        }

        let years = (duration.getFullYear() - 1970);
        let months = duration.getMonth();
        let days = duration.getDate();
    
        let yearTxt = "year";
        let monthTxt = "month";
        let dayTxt = "day";
    
        if (years > 1) yearTxt += "s";
        if (months > 1) monthTxt += "s";
        if (days > 1) dayTxt += "s";
    
        if (years >= 1) {
            duration = `${years} ${yearTxt} ${months} ${monthTxt} ${days} ${dayTxt}`;
        } else if (months >= 1) {
            duration = `${months} ${monthTxt} ${days} ${dayTxt}`;
        } else {
            duration = `${days} ${dayTxt}`;
        } 
            return duration;
    }

    const projectDesc = req.body.description;
    const techIcon = {
        nodeJs: req.body.nodeJs,
        reactJs: req.body.reactJs,
        android: req.body.android,
        java: req.body.java
    }
    const projectImage = req.body.image;
    
    let durationDate = `${moment(projectDate.startDate).format('DD MMM YYYY')} - ${moment(projectDate.endDate).format('DD MMM YYYY')}`;

    let projectDuration = getProjectDuration();
    
    const project = {
        projectName,
        projectDate,
        projectDesc,
        techIcon,   
        projectImage,
        durationDate,
        projectDuration,
        isLogin,
    };
    projects.push(project);
    res.redirect('/');
});

app.get('/project-detail/:index', (req, res) => {
    let i = req.params.index;

    const project = projects[i];

    res.render('project-detail', { i, isLogin, project});
});

app.get('/delete-project/:index', (req, res) => {
    const index = req.params.index;
    projects.splice(index, 1);
    
    res.redirect('/');
});

app.get('/update-project/:index', (req, res) => {
    let i = req.params.index;

    let update = projects[i];

    res.render('update-project', { i, update, projects });
});

app.post('/update-project/:index', (req, res) => {

    const projectName = req.body.projectName;
    const projectDate = {
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }

    function getProjectDuration(){
        const end = new Date(projectDate.endDate);
        const start = new Date(projectDate.startDate);
    
        let duration = ``;
    
        if (start < end) {
          duration = new Date(end - start);
        }

        let years = (duration.getFullYear() - 1970);
        let months = duration.getMonth();
        let days = duration.getDate();
    
        let yearTxt = "year";
        let monthTxt = "month";
        let dayTxt = "day";
    
        if (years > 1) yearTxt += "s";
        if (months > 1) monthTxt += "s";
        if (days > 1) dayTxt += "s";
    
        if (years >= 1) {
            duration = `${years} ${yearTxt} ${months} ${monthTxt} ${days} ${dayTxt}`;
        } else if (months >= 1) {
            duration = `${months} ${monthTxt} ${days} ${dayTxt}`;
        } else {
            duration = `${days} ${dayTxt}`;
        } 
            return duration;
    }

    const projectDesc = req.body.description;
    const techIcon = {
        nodeJs: req.body.nodeJs,
        reactJs: req.body.reactJs,
        android: req.body.android,
        java: req.body.java
    }
    const projectImage = req.body.image;
    
    let durationDate = `${moment(projectDate.startDate).format('DD MMM YYYY')} - ${moment(projectDate.endDate).format('DD MMM YYYY')}`;

    let projectDuration = getProjectDuration();
    
    const projectUpdate = {
        projectName,
        projectDate,
        projectDesc,
        techIcon,   
        projectImage,
        durationDate,
        projectDuration,
    };
    
    let i = req.params.index;

    projects[i] = {
        ...projects[i],
        ...projectUpdate
    };

    res.redirect('/');
});

