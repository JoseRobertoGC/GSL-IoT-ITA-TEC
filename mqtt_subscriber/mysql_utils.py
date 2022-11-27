'''
To install mysql-connector run this command in the terminal:  pip install mysql-connector-python
A nice tutorial is here: https://www.w3schools.com/python/python_mysql_getstarted.asp
'''
import mysql.connector
from mysql.connector import Error


def connect_mysql(host, user, password):
    dbconn = mysql.connector.connect(host=host,
                                     user=user,
                                     password=password)
    return dbconn

def disconnect_db(connection):
    if connection.is_connected():
        connection.close()
        print("MySQL connection is closed")


def create_db(dbname, conn):
    mycursor = conn.cursor()
    mycursor.execute("CREATE DATABASE "+ dbname)

def create_table(connection,dbname, sqlSTR):
    try:
        select_db(connection)
        cursor = connection.cursor()
        result = cursor.execute(sqlSTR)
        print("Severity Table created successfully")
    except mysql.connector.Error as error:
        print("Failed to create table in MySQL: {}".format(error))

def insert_values(connection, sqlSTR):
    try:
        select_db(connection)
        cursor = connection.cursor()
        cursor.execute(sqlSTR)
        connection.commit()
        print(cursor.rowcount, "Record inserted successfully into {0} table".format(dbname))
        cursor.close()
    except mysql.connector.Error as error:
        print("Failed to insert record into {0} table {1}".format(dbname, error))

def select_values (dbConn,sqlSTRQuery):
    mycursor = dbConn.cursor()
    mycursor.execute(sqlSTRQuery)
    myresult = mycursor.fetchall()
    for x in myresult:
        print(x)
    return myresult

def select_db(connection):
    cursor = connection.cursor()
    cursor.execute("USE "+dbname)

def drop_db(dbname, connection):
    cursor = connection.cursor()
    sql = 'DROP DATABASE ' + dbname
    cursor.execute(sql)

def create_sql_query(client_id, severity, latitude, longitude):
    mySql_insert_query = """INSERT INTO Severity (CLIENT_ID, SEVERITY, LATITUDE, LONGITUDE) 
                           VALUES 
                           (\"{0}\", \"{1}\", {2}, {3}) """.format(client_id, severity, latitude, longitude)
    return mySql_insert_query

host = '192.168.15.3'
user = 'root'
password = 'root'
dbname = 'GSL_IoT_ITA_TEC'

sqlSTR = """CREATE TABLE Severity ( 
                             Id int(11) NOT NULL AUTO_INCREMENT,
                             CLIENT_ID varchar(250) NOT NULL,
                             SEVERITY varchar(15) NOT NULL,
                             LATITUDE float NOT NULL,
                             LONGITUDE float NOT NULL,
                             PRIMARY KEY (Id)) """

dbconn = connect_mysql(host, user, password)

if __name__ == '__main__':
    drop_db('GSL_IoT_ITA_TEC',dbconn)
    create_db("GSL_IoT_ITA_TEC",dbconn)
    create_table(dbconn, dbname,sqlSTR)
    disconnect_db(dbconn)


