import random

for i in range(1000):
    list = []
    
    dict = {'time': random.randrange(00,23,1), 'location': [random.uniform(19.126067,19.127069),random.uniform(72.033855 ,72.870744)],'date':[random.randrange(1,28,1),random.randrange(1,12,1)]}
    list.append(dict)
    print(list)