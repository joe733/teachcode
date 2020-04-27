a = 103
k = sum(1 for i in range(2,a//2+1) if (a%i==0))
if(k<=0):
    print("Prime!")
else:
    print("Not Prime!")
