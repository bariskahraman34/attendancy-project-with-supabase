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
        <table style="width: 100%">
            <thead>
                <th>İsim</th>
                <th>Soyisim</th>
                <th>Öğrenci ID</th>
                <th>Email</th>
            </thead>
            <tbody>
            ${data.map(student => {
                return`
                    <tr>
                        <td>${student.first_name}</td>
                        <td>${student.last_name}</td>
                        <td>${student.student_id}</td>
                        <td>${student.email}</td>
                    </tr>
                `
            }).join('')}
            </tbody>
        </table>
    </div>
    `;
}

async function listLessons(){
    const data = await getData("Lessons");
    console.log("Lessons: ",data);
}

listLessons();
listStudents();
listAttendance();