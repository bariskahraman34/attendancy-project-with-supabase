const content = document.querySelector('.content');
const SUPABASE_URL = 'https://jkkztvzwqadcwqizlquo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impra3p0dnp3cWFkY3dxaXpscXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5Mjc0NjMsImV4cCI6MjAzMDUwMzQ2M30.p-HDJiefI2bBt6dY_kk01WzWD2Xu628SfxymPg0xGGA';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const toggleMenu = document.querySelector('.toggle-menu');
const asideMenu = document.querySelector('.aside-menu');
const closeMenu = document.querySelector('.close-menu');
toggleMenu.addEventListener('click',() => {
    asideMenu.classList.add('show');
})

closeMenu.addEventListener('click',() => {
    asideMenu.classList.remove('show');
})

async function getData(tableName){
    const { data, error } = await _supabase.from(`${tableName}`).select()
    if(error){
        return [];
    }
    return data
}

async function listAttendance(){
    const attendance = await getData("attendance");
    const students = await getData("Students");
    const lessons = await getData("Lessons");
    const uniqueDates = [];
    attendance.forEach(att => !uniqueDates.includes(att.created_at) ? uniqueDates.push(att.created_at) : []);
    content.innerHTML = 
    `
    <div class="filter-form">
        <h3>Filtreleme</h3>
        <form  id="filter-attendancy">
            <select id="lessons" name="lesson_id" required>
                <option value="" selected disabled hidden>Ders seçiniz</option>
                ${lessons.map(lesson => {
                    return `<option value="${lesson.id}">${lesson.lesson_name}</option>`
                }).join('')}
            </select>
            <select id="date" name="created_at" required>
                <option value="" selected disabled hidden>Yoklama tarihini seçiniz</option>
                ${uniqueDates.map(att => {
                    return `<option value="${att}">${att}</option>`
                }).join('')}
            </select>
            <button>Tamamla</button>
        </form>
    </div>
    <div class="list-container" id="attendance-list">
        <table>
            <thead>
                <th>Ders Adı</th>
                <th>Sınıf</th>
                <th>Öğrenci Adı</th>
                <th>Öğrenci Soyadı</th>
                <th>Öğrenci No</th>
                <th>Yoklama Tarihi</th>
                <th>Devamlılık Durumu</th>
            </thead>
            <tbody>
            ${attendance.map(item => {
                return`
                    <tr>
                        <td>${lessons.find(lesson => lesson.id == item.lesson_id)?.lesson_name}</td>
                        <td>${lessons.find(lesson => lesson.id == item.lesson_id)?.class}</td>
                        <td>${students.find(student => student.student_id == item.student_id)?.first_name}</td>
                        <td>${students.find(student => student.student_id == item.student_id)?.last_name}</td>
                        <td>${item.student_id}</td>
                        <td>${item.created_at}</td>
                        <td>${item.status == true ? "Devamlı" : "Devamsız"}</td>
                    </tr>
                `
            }).join('')}
            </tbody>
        </table>
    </div>
    `;
    const filterAttendancyForm = document.querySelector('#filter-attendancy');
    filterAttendancyForm.addEventListener('submit',filterAttendancy);
}

async function filterAttendancy(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const students = await getData("Students");
    const lessons = await getData("Lessons");
    let { data: attendance, error } = await _supabase
    .from('attendance')
    .select("*")
    .eq('lesson_id', `${formObj.lesson_id}`)
    .eq('created_at',`${formObj.created_at}`);
    const attendanceContainer = document.querySelector('#attendance-list');
    if(attendance.length > 0){
        attendanceContainer.innerHTML =
        `
        <table>
            <thead>
                <th>Ders Adı</th>
                <th>Sınıf</th>
                <th>Öğrenci Adı</th>
                <th>Öğrenci Soyadı</th>
                <th>Öğrenci No</th>
                <th>Yoklama Tarihi</th>
                <th>Devamlılık Durumu</th>
            </thead>
            <tbody>
            ${attendance.map(item => {
                return`
                    <tr>
                        <td>${lessons.find(lesson => lesson.id == item.lesson_id)?.lesson_name}</td>
                        <td>${lessons.find(lesson => lesson.id == item.lesson_id)?.class}</td>
                        <td>${students.find(student => student.student_id == item.student_id)?.first_name}</td>
                        <td>${students.find(student => student.student_id == item.student_id)?.last_name}</td>
                        <td>${item.student_id}</td>
                        <td>${item.created_at}</td>
                        <td>${item.status == true ? "Devamlı" : "Devamsız"}</td>
                    </tr>
                `
            }).join('')}
            </tbody>
        </table>
        `;
    }else{
        attendanceContainer.innerHTML = "<h3>Bu filtreye ait öğrenci bulunamadı.</h3>"
    }
}



async function listStudents(){
    const data = await getData("Students");
    content.innerHTML = 
    `
    <div class="list-container" id="students-list">
        <button class="table-btn" id="add-student-btn">Öğrenci Ekle</button>
        <table>
            <thead>
                <th>İsim</th>
                <th>Soyisim</th>
                <th>Öğrenci ID</th>
                <th>Email</th>
                <th>Sınıf</th>
            </thead>
            <tbody>
            ${data.map(student => {
                return`
                    <tr>
                        <td>${student.first_name}</td>
                        <td>${student.last_name}</td>
                        <td>${student.student_id}</td>
                        <td>${student.email}</td>
                        <td>${student.class}</td>
                    </tr>
                `
            }).join('')}
            </tbody>
        </table>
    </div>
    `;
    const addStudentBtn = document.querySelector('#add-student-btn');
    addStudentBtn.addEventListener('click',() => addStudent());
}

async function listLessons(){
    const data = await getData("Lessons");
    content.innerHTML = 
    `
    <div class="list-container" id="lessons-list">
        <table>
            <thead>
                <th>Ders Adı</th>
                <th>Sınıf</th>
            </thead>
            <tbody>
            ${data.map(lesson => {
                return`
                    <tr>
                        <td>${lesson.lesson_name}</td>
                        <td>${lesson.class}</td>
                    </tr>
                `
            }).join('')}
            </tbody>
        </table>
    </div>
    `;
}

async function addStudent(){
    const lessonsData = await getData("Lessons");
    const form = 
    `
    <form class="add-form" id="add-student-form">
        <label for="first_name">İsim</label><br>
        <input type="text" id="first_name" name="first_name" required><br>
        
        <label for="last_name">Soyisim</label><br>
        <input type="text" id="last_name" name="last_name" required><br>
        
        <label for="student_id">Öğrenci ID</label><br>
        <input type="text" id="student_id" name="student_id" required><br>
        
        <label for="email">E-posta</label><br>
        <input type="email" id="email" name="email" required><br>
        
        <label for="class">Ders</label><br>
        <select id="class" name="class" required>
            <option value="" selected disabled hidden>Ders Seçiniz</option>
            ${lessonsData.map(lesson => {
                return `<option value="${lesson.class}">${lesson.lesson_name}</option>`
            }).join('')}
        </select><br><br>
        <button class="form-btn" type="submit">Gönder</button>
    </form>
    `;
    content.innerHTML += form;
    const addStudentForm = document.querySelector('#add-student-form');
    addStudentForm.addEventListener('submit',(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        return createData("Students",formObj)
    })
}

async function createData(tableName,data){
    const { error } = await _supabase.from(tableName).insert(data);
    if(error){
        if(error.code === "23505"){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Bu kullanıcı zaten mevcut!",
                confirmButtonText:"Anladım"
              });
        }
    }
    if(tableName == "Students"){
        Swal.fire("Öğrenci Başarıyla Eklendi!");
        return listStudents();
    }else if(tableName == "Lessons"){
        return listLessons();
    }else if(tableName == "attendance"){
        Swal.fire("Yoklama Başarıyla Tamamlandı!");
        return listAttendance();
    }
}

async function createAttendancy(){
    const lessons = await getData("Lessons");
    content.innerHTML =
    `
    <div class="create-attendancy-div">
        <form id="create-attendancy-form">
            <select id="lesson" name="lesson" required>
                <option value="" selected disabled hidden>Ders Seçiniz</option>
                ${lessons.map(lesson => {
                    return `<option value="${lesson.class}">${lesson.lesson_name} - ${lesson.class}</option>`
                }).join('')}
            </select>
            <button class="form-btn">Yoklamayı Oluştur</button>
        </form>
    </div>
    `;
    const createAttendancyForm = document.querySelector('#create-attendancy-form');
    createAttendancyForm.addEventListener('submit',(e) => handleAttendancyForm(e));
}


async function getSpecialData(tableName,columnName,rowName){
    const { data, error } = await _supabase.from(`${tableName}`).select().eq(columnName,rowName)
    if(error){
        return [];
    }
    return data
}
async function handleAttendancyForm(e){
    e.preventDefault();
    const classId = document.querySelector("select[name='lesson']").value;
    const students = await getSpecialData("Students","class",`${classId}`);
    const lessons = await getData("Lessons");
    if(students.length > 0){
        content.innerHTML = 
        `
            <table>
                <thead>
                    <th>İsim</th>
                    <th>Soyisim</th>
                    <th>Öğrenci ID</th>
                    <th>Email</th>
                    <th>Sınıf</th>
                    <th>Yoklama Durumu</th>
                </thead>
                <tbody>
                ${students.map(student => {
                    return`
                        <tr>
                            <td>${student.first_name}</td>
                            <td>${student.last_name}</td>
                            <td>${student.student_id}</td>
                            <td>${student.email}</td>
                            <td>${student.class}</td>
                            <td>
                                <form class="status-form">
                                        <input type="radio" id="${student.student_id}-true" name="${student.student_id}" value="true">
                                        <label for="${student.student_id}-true">Devamlı</label><br>
                                        <input type="radio" id="${student.student_id}-false" name="${student.student_id}" value="false">
                                        <label for="${student.student_id}-false">Devamsız</label>
                                </form>
                            </td>
                        </tr>
                    `
                }).join('')}
                </tbody>
            </table>
            <button type="submit" id="status-submit-btn" class="form-btn">Tamamla</button>
        `;
        const submitStatusBtn = document.querySelector('#status-submit-btn');
        const attendancyArray = [];
        submitStatusBtn.addEventListener('click',(e) => {
            e.preventDefault();
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
            const day = (date.getDate()) < 10 ?  `0${date.getDate()}` : `${date.getDate()}`;
            const created_at = `${year}-${month}-${day}`;
            const radioInputs = document.querySelectorAll('input[type="radio"]');
            radioInputs.forEach(input => input.checked ? attendancyArray.push({student_id:input.name,status:input.value,created_at:created_at,lesson_id:lessons.find(lesson => lesson.class == students.find(student => student.student_id == input.name)?.class)?.id}) : false);
            return createData("attendance",attendancyArray);
        })
    }else{
        content.innerHTML = "<div><h3>Bu sınıfa ait öğrenci bulunamadı.</h3></div>"
    }
}

listStudents();