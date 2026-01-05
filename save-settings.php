<?php
$data = file_get_contents('php://input');
if($data){
    file_put_contents('settings.json',$data);
    echo "تم حفظ التغييرات للزوار!";
} else {
    echo "لم يتم استلام البيانات!";
}
?>
