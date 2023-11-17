import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import pickle

queries = {
    "s1" : "Select 1",
    "s2" : "Select 2",
    "j1" : "Join Simple 1",
    "j2" : "Join Simple 2",
    "m1" : "Join Multiple 1",
    "m2" : "Join Multiple 2",
}

tecnica = {
    "Tecnica 1" : "NoSQLayer",
    "Tecnica 2" : "SDOD"
}

def size_to_num(size_str):
    if size_str[-1] == "k":
        return int(size_str[:-1]) * 1000
    elif size_str[-1] == "m":
        return int(size_str[:-1]) * 1000000
    else:
        raise Exception("Invalid size format")

def get_std_error(q, tec):
    df = pd.read_csv(f"results/{q}_{tec}.csv")
    df["DB SIZE"] = df["DB SIZE"].apply(size_to_num)
    #df = df[df["DB SIZE"] == db_size]
    df = df.drop(columns=["DB SIZE"])
    df = df.to_numpy()
    df = np.std(df, axis=1)
    return df
    

for q, q_title in queries.items():
    csv_file = f"results/{q}_avg.csv"
    df = pd.read_csv(csv_file) #, index_col=0)
    print(df)
    df["DB SIZE"] = df["DB SIZE"].apply(size_to_num)
    print(df)
    
    plt.title(f"Consulta: {q_title}")
    plt.ylabel("Tiempo de Ejecucción (ms)")
    plt.xlabel("Tamaño de Base de Datos (# de Documentos)")
    data_x = df["DB SIZE"].to_numpy()
    for col in df.columns:
        if col != "DB SIZE":
            data_y = df[col].to_numpy()
            std_y = get_std_error(q, col)
            #plt.errorbar(data_x,data_y, yerr=std_y, fmt='o--', label=tecnica[col])
            plt.plot(data_x,data_y, ribbon=std_y, label=tecnica[col])
    plt.xscale("log")
    plt.legend()
    plt.savefig(f"figs/{q}_avg.svg")
    plt.clf()
    #plt.show()

    """
    df.plot.bar()
    plt.title(f"Query {q_title}")
    plt.ylabel("Time (ms)")
    plt.xlabel("Database Size")
    plt.show()
    """