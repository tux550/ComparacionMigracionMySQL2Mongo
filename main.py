import subprocess
import time
import pandas as pd
import numpy as np
import pickle

mongo_uri = "mongodb://localhost:27017/"


tecnica_names = {
  "Tecnica 1": "t1",
  "Tecnica 2": "t2",
}
db_size_names = {
  #"demo_size" : "demo_{tec}",
  "1k" : "exp_1k_{tec}",
  "10k" : "exp_10k_{tec}",
  "100k" : "exp_100k_{tec}",
  "1m" : "exp_1m_{tec}",
}
queries = ["s1","s2","j1","j2","m1","m2"]

SCRIPT_PATH = ".\\scripts\\{tecnica}\\{query}.js"
CMD = "mongosh --quiet --eval \"var db_name='{db_name}'\" -f \"{script_path}\""
REPETITIONS = 10

queries_results = {}




def create_experiment_table():
  table = {}
  table["DB SIZE"] = []
  for i in range(REPETITIONS):
    table[f"REP {i+1}"] = []
  return table

for query in queries:
  print("TEST QUERY: ", query)
  query_results = {}
  
  AVG_QUERY_RESULTS = {}
  AVG_QUERY_RESULTS["DB SIZE"]= []
  for db_size in db_size_names:
    AVG_QUERY_RESULTS["DB SIZE"].append( db_size )
  for tecnica_name in tecnica_names:
    AVG_QUERY_RESULTS[tecnica_name] = []
  
  for tecnica_name, tec in tecnica_names.items():
    print("> TECNICA: ", tecnica_name)
    TABLE = create_experiment_table()
    for db_size, db_format_name in db_size_names.items():
      print(">> DB SIZE: ", db_size)
      TABLE["DB SIZE"].append( db_size )
      avg_time = 0
      for i in range(REPETITIONS):
        print(">>> REPETITION: ", i)
        db_name = db_format_name.format(tec=tec)
        script_path = SCRIPT_PATH.format(tecnica=tec, query=query)
        cmd = CMD.format(db_name=db_name, script_path=script_path)
        #print(cmd)
        cmd_result = subprocess.getoutput(cmd)
        execution_time = int(cmd_result)
        print("Execution Time:", execution_time)
        TABLE[f"REP {i+1}"].append( execution_time )
        avg_time+=execution_time
        #subprocess.run(cmd, shell=True)
      avg_time = avg_time/REPETITIONS
      AVG_QUERY_RESULTS[tecnica_name].append(avg_time)
    df = pd.DataFrame(TABLE)
    df.to_csv(f"results/{query}_{tecnica_name}.csv", index=False)
    query_results[tecnica_name] = df
  queries_results[query] = query_results
  df = pd.DataFrame(AVG_QUERY_RESULTS)
  df.to_csv(f"results/{query}_avg.csv", index=False)
pickle.dump(queries_results, open("results/queries_results.pkl", "wb"))

#print(query_results)
#df = pd.DataFrame(query_results)
#df.to_csv(f"results/{query}.csv", index=False)
"""
for tecnica_name, (tec, db_name_ls) in db_name.items():
  for db in db_name_ls:
    for query in queries:
      script_path = SCRIPT_PATH.format(tecnica=tec, query=query)
      cmd = CMD.format(db_name=db, script_path=script_path)
      print("TECNICA: ", tecnica_name, "DB: ", db, "QUERY: ", query)
      print(cmd)
      cmd_result = subprocess.getoutput(cmd)
      print(int(cmd_result))
      #subprocess.run(cmd, shell=True)
"""