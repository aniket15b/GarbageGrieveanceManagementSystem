import random
import csv
lists = []
for i in range(1000):
    
    l = [ str(random.uniform(18.89395652,19.4998677114)), str(random.uniform(73.2453875317,72.6466326489)), chr(random.randrange(97, 97 + 26)), str(random.randrange(00,23,1))+':'+str(random.randrange(00,59,1))+':'+str(random.randrange(00,59,1)), 1]
    lists.append(l)


with open('employee_file.csv', mode='w') as employee_file:
    employee_writer = csv.writer(employee_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    for i in range(1000):
       employee_writer.writerow(lists[i]) 
