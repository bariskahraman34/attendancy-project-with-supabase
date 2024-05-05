const content = document.querySelector('.content');
const SUPABASE_URL = 'https://jkkztvzwqadcwqizlquo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impra3p0dnp3cWFkY3dxaXpscXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5Mjc0NjMsImV4cCI6MjAzMDUwMzQ2M30.p-HDJiefI2bBt6dY_kk01WzWD2Xu628SfxymPg0xGGA';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getData(tableName){
    const { data, error } = await _supabase.from(`${tableName}`).select()
    if(error){
        return [];
    }
    return data
}

async function listAttendance(){
    const data = await getData("attendance");
    console.log("Attendance: ",data);
}

async function listStudents(){
    const data = await getData("Students");
    console.log("Students: ",data);
    content.innerHTML = 
    `
    <div class="students-list">
        <button class="table-btn" id="add-student-btn">Öğrenci Ekle</button>
        <table style="width: 100%">
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
    console.log("Lessons: ",data);
    content.innerHTML = 
    `
    <div class="lessons-list">
        <table style="width: 100%">
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

function addStudent(){
    const form = 
    `
    <form class="add-form" id="add-student-form">
        <label for="first_name">İsim</label><br>
        <input type="text" id="first_name" name="first_name"><br>
        
        <label for="last_name">Soyisim</label><br>
        <input type="text" id="last_name" name="last_name"><br>
        
        <label for="student_id">Öğrenci ID</label><br>
        <input type="text" id="student_id" name="student_id"><br>
        
        <label for="email">E-posta</label><br>
        <input type="email" id="email" name="email"><br>
        
        <label for="class">Ders</label><br>
        <select id="class" name="class">
            <option value="101">JavaScript</option>
            <option value="102">React</option>
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
        return createData(formObj)
    })
}

async function createData(userData){
    const { error } = await _supabase.from('Students').insert(userData);
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
    return listStudents();
}