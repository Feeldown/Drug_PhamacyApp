import json
import csv
from collections import Counter
import os

def load_drug_forms():
    forms = []
    
    # Try loading from JSON first
    if os.path.exists('drug_full_details.json'):
        with open('drug_full_details.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            forms.extend([item.get('รูปแบบยา', '').strip() for item in data if item.get('รูปแบบยา')])
    
    # Try loading from CSV as backup
    elif os.path.exists('drug_full_details.csv'):
        with open('drug_full_details.csv', 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            forms.extend([row.get('รูปแบบยา', '').strip() for row in reader if row.get('รูปแบบยา')])
    
    # Count unique forms
    counter = Counter(forms)
    
    # Save results
    with open('drug_forms_summary.txt', 'w', encoding='utf-8') as f:
        f.write("=== สรุปรูปแบบยา ===\n\n")
        f.write(f"จำนวนรูปแบบยาที่พบทั้งหมด: {len(counter)} รูปแบบ\n")
        f.write(f"จำนวนรายการยาที่มีข้อมูลรูปแบบยา: {len(forms)} รายการ\n\n")
        f.write("รายละเอียดแต่ละรูปแบบ:\n")
        f.write("-" * 50 + "\n")
        
        for form, count in sorted(counter.items(), key=lambda x: (-x[1], x[0])):
            f.write(f"{form}: {count} รายการ\n")
    
    print(f"พบรูปแบบยาทั้งหมด {len(counter)} รูปแบบ")
    print(f"บันทึกรายละเอียดไว้ใน drug_forms_summary.txt แล้ว")

if __name__ == "__main__":
    load_drug_forms() 