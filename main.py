#Kyle Dellock  6/12/2025
"""
I thought this assignment would be a good opportunity to try and make a very basic flask application
for the file to work properly you'll need to make sure to have either the env folder or flask installed
on your machine, the templates folder for the html, and the static folder for the css and js, I added
the javascript to update the css front end dynamically as well as recieve the send and recive data 
all backend calculations and the server are done in python!

DEFAULT LOCAL URL AFTER RUNNING: http://127.0.0.1:5000
"""


from sys import exit 
from os import path
try:
    from flask import Flask, render_template, url_for, request, jsonify
except:
    print("Import error -- Flask not found")
    print("Please ensure that Flask is installed on your machine or that virtual environment is properly activated")
    exit()


#PriceTracker is used track the users current price
class PriceTracker:
    def __init__(self):
        self.price = 0.0

    def add(self, amount):
        self.price += amount

    def get_price(self):
        return self.price

app = Flask(__name__)
tracker_list = []
id_num = [-1] #starts the id num at -1 to allow incermentation before return value

@app.route('/')
@app.route('/index')
def home(): #binds the sever too the html file as well as ensuring python connects the css and javascript to the html file
    css = url_for('static', filename='style.css')
    js = url_for('static', filename='script.js')

    return render_template('index.html', css_path=css, js_path=js)

@app.route('/assign_number', methods = ['POST'])#binds an id number to the client as well as creating a paralell array element for a prictracker object to
def assign_number():
    #print(id_num[0])
    id_num[0] = id_num[0] + 1 #would rather mutate a list than declare a global variable, no way to pass values into these functions aside for json from the front end so mutatable objects or global variables are unavoidable
    tracker_list.append(PriceTracker()) 
    return jsonify({"id_num":f"{id_num[0]}"})
   

@app.route('/add_price', methods=['GET']) #called everytime a button that updates the price is called, used to update the price tracker object
def add_price():
    
    try:
        id_num = int(request.args.get('id_num', 0))
        #print("test")
        #print(id_num)
        amount = float(request.args.get('amount', 0))
        #print(amount)
        tracker_list[id_num].add(amount)
        return jsonify({"message": f"Price updated to ${tracker_list[id_num].get_price():.2f}"})
    except:
        return jsonify({"error": "Invalid amount"}), 400


@app.route('/checkout', methods=['POST', 'GET'])#updates the checkout label to whatever value is stored within the users PriceTracker
def checkout():
    try:
        if request.method == "POST":
            data = request.get_json()
            id_num = int(data.get("id_num", 0))
        else:  # GET method
            id_num = int(request.args.get("id_num", 0))#recieve ID from server to fetch
        
        return jsonify({"price": f"${tracker_list[id_num].get_price():.2f}"})
    
    except:
        print("Checkout Error:")
        return jsonify({"error": "Invalid checkout request"}), 400
    
app.run()